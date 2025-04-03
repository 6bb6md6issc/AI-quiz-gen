import MaxWidthWrapper from '@/components/common/MaxWidthWrapper'
import { prisma } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import Quiz from "@/components/Quiz"
import React from 'react'

const page = async ({ params } : { params: {id: string} }) => {

    const { getUser } = getKindeServerSession();
    const { id } = await params;
    const user = await getUser();
    if (!user) {
        return redirect('/');
    }
    const quiz = await prisma.quiz.findUnique({
        where: {
          id,
          userId: user.id,
        },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    return (
        <MaxWidthWrapper className='mt-20'>
            <Quiz quizData={quiz} />
        </MaxWidthWrapper>
    );
}

export default page