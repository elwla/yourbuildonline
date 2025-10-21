import AuthRequest from '@/middlewares/AuthMiddleware';

import ProjectForm from "@/components/projectForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from 'next/navigation';
import React from 'react';

const NewPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/login?from=${encodeURIComponent('/new')}`);
  }

  return (
    <div>
      <ProjectForm/>
    </div>
  );
};

export default NewPage;