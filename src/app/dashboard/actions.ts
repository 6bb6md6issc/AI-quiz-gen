"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import axios from "axios";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { prisma } from "@/lib/db";

const QuizSchema = z.object({
    questions: z.array(
        z.object({
          question: z.string(),
          answers: z.array(
            z.object({
              text: z.string(),
              correct: z.boolean(),
            })
          ),
        })
    ),
})

const YOUTUBE_LINK_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(\S*)?$/;

function validateYoutubeLink(link: string){
    const isValid = YOUTUBE_LINK_REGEX.test(link);
    // console.log(isValid);
    if(!isValid){
        throw new Error("Invalid YouTube Link")
    }

    let videoId: string | null = null;

    if (link.includes("youtube.com")){
        videoId = new URL(link).searchParams.get('v');
    } else if (link.includes('youtu.be')) {
        videoId = link.split('youtu.be/')[1]?.split("?")[0];
    }
    // console.log(videoId);
    if(!videoId || videoId.length !== 11){
        // console.log("debugger 3.3")
        throw new Error("invalid YouTube Link");
    }
    return videoId;
}

async function getSubtitles(id: string) {
  const options = {
    method: 'GET',
    url: 'https://youtube138.p.rapidapi.com/auto-complete/',
    params: {
      q: 'desp',
      hl: 'en',
      gl: 'US'
    },
    headers: {
      'x-rapidapi-key': 'c93efe91b7mshf3bf25a4b4eb4c8p1262f9jsna747096e22e9',
      'x-rapidapi-host': 'youtube138.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching subtitles:", error);
    throw error;
  }
}

async function generateQuizFromTranscript(transcript: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Generate a quiz with 10 multiple-choice questions based on the following podcast transcript. 
  Each question should have 4 possible answers, with exactly one correct answer. Make sure the questions are all related to the podcast.
  Do not make references to the transcript, just make up questions based on the podcast.
  
  Transcript:
  ${transcript}
  
  Provide the output in the following JSON format:
  {
    "questions": [
      {
        "question": "Question text here?",
        "answers": [
          {"text": "Answer 1", "correct": false},
          {"text": "Answer 2", "correct": true},
          {"text": "Answer 3", "correct": false},
          {"text": "Answer 4", "correct": false}
        ]
      }
    ]
  }`;

  try {
    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates quiz questions based on provided content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(QuizSchema, "quiz"),
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    const rawResponse = JSON.parse(completion.choices[0].message.content);
    const validatedQuiz = QuizSchema.parse(rawResponse);
    return validatedQuiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}

export async function generateQuiz(formData: FormData){
  try{
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return {error: "unauthorized", success: false}
    }
    // console.log("bebugger1");
    const youtubeLink = formData.get("video-url") as string;
    if (!youtubeLink){
      return {error: "YouTube link is required" }
    }
    // console.log("bebugger2");
    const videoId = validateYoutubeLink(youtubeLink);
    // console.log(videoId);
    const transcript = await getSubtitles(videoId);
    // console.log(transcript)
    const quiz = await generateQuizFromTranscript(transcript);

    const createdQuiz = await prisma.quiz.create({
      data: {
        userId: user.id,
        questions: {
          create: quiz.questions.map(question => ({
            question: question.question,
            answers: {
              create: question.answers.map(answer => ({
                text: answer.text,
                correct: answer.correct,
              })),
            },
          })),
        },
      },
    });
    // console.log("bebugger3");
    revalidatePath("/dashboard");
    return { 
      success: true, 
      quizId: createdQuiz.id 
    };
  } catch (error) {
    return { 
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "Failed to generate quiz. Please try again." 
    };
  }
}