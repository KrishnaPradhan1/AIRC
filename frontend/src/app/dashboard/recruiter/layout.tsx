'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RecruiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['recruiter']}>
            {children}
        </ProtectedRoute>
    );
}
