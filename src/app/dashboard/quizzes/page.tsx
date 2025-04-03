import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { CalendarDays, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

async function getQuizzes() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/login");
    }

    const quizzes = await prisma.quiz.findMany({
        where: {
            userId: user.id,
        },
        include: {
            questions: true,
            user: {
            select: {
                name: true,
            },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return quizzes;
}


const page = async () => {
    const quizzes = await getQuizzes();

    return (
        <MaxWidthWrapper className='mt-20'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-4xl font-bold'>Quizzes</h1>
                <Link href="/dashboard" className={buttonVariants({variant: "outline"})}>
                    Create Quiz
                </Link>
            </div>
            {
                quizzes.length === 0 ? (
                    <Card className='bg-muted'>
                        <CardContent className='flex flex-col items-center justify-center py-10 text-center'>
                            <h3 className='text-2xl font-semibold mb-2'>No Quiz Yet</h3>
                            <p className='text-muted-foreground mb-4'>
                                Create your first quiz to get started
                            </p>
                            <Link href='/dashboard' className={buttonVariants({variant: "outline"})}>
                                Create Quiz
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            quizzes.map(quiz=>{
                                return(
                                    <Card key={quiz.id} className='hover:shadow-lg transition-shadow'>
                                        <CardContent className='pt-4'>
                                            <div className='space-y-4'>
                                                <div className='flex items-center text-muted-foreground'>
                                                  <CalendarDays className='mr-2 h-4 w-4' />
                                                  {new Date(quiz.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className='flex items-center text-muted-foreground'>
                                                    <ListChecks className='mr-2 h-4 w-4' />
                                                    {quiz.questions.length} questions
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Link href={`/dashboard/quizzes/${quiz.id}`} className={buttonVariants({variant:"default"})}>
                                                Take quiz
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                )
                            })
                        }
                    </div>
                )
            }
        </MaxWidthWrapper>
    )
}

export default page