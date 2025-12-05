'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function JobApplicationsPage() {
    const params = useParams();
    const [applications, setApplications] = useState<any[]>([]);
    const [job, setJob] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobRes = await api.get(`/jobs/${params.id}`);
                setJob(jobRes.data);

                // We need an endpoint to get applications for a specific job
                // Currently we don't have one, let's assume we add it or filter on frontend (not ideal)
                // Let's add GET /jobs/<id>/applications to backend
                const appsRes = await api.get(`/jobs/${params.id}/applications`);
                setApplications(appsRes.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        if (params.id) fetchData();
    }, [params.id]);

    const handleAnalyze = async (appId: number) => {
        try {
            const res = await api.post(`/analysis/${appId}`);
            // Update local state
            setApplications(apps => apps.map(app =>
                app.id === appId ? { ...app, score: res.data.score, analysis_summary: res.data.summary } : app
            ));
        } catch (err) {
            alert('Analysis failed');
        }
    };

    if (!job) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{job.title} - Candidates</h1>
            <p className="text-gray-400 mb-8">Review and analyze applications.</p>

            <div className="grid gap-6">
                {applications.length === 0 ? (
                    <p className="text-gray-400">No applications yet.</p>
                ) : (
                    applications.map((app) => (
                        <Card key={app.id} className="p-6 bg-white/5 border-white/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Candidate #{app.student_id}</h2>
                                    <p className="text-gray-400 text-sm mt-1">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                                    {app.score !== undefined && app.score !== null && (
                                        <div className="mt-2">
                                            <span className="text-lg font-bold text-blue-400">Score: {app.score}%</span>
                                            <p className="text-sm text-gray-300 mt-1">{app.analysis_summary}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                        View Resume
                                    </Button>
                                    <Button
                                        onClick={() => handleAnalyze(app.id)}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        Analyze with AI
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
