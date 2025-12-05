'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api, { applyJob } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function JobDetailsPage() {
    const params = useParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [resume, setResume] = useState<File | null>(null);
    const [applying, setApplying] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${params.id}`);
                setJob(response.data);
            } catch (err) {
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchJob();
    }, [params.id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleApply = async () => {
        if (!resume) {
            alert('Please upload a resume first.');
            return;
        }
        setApplying(true);
        try {
            await applyJob(params.id as string, resume);
            setSuccess(true);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (error) return <div className="p-8 text-red-400">{error}</div>;
    if (!job) return <div className="p-8 text-white">Job not found</div>;

    return (
        <div className="min-h-screen p-8 flex justify-center">
            <Card className="w-full max-w-4xl p-8 bg-white/10 backdrop-blur-md border-white/20 text-white h-fit">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">{job.title}</h1>
                        <p className="text-gray-400 mt-1">Posted on {new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                    {job.deadline && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-blue-300">Description</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-blue-300">Requirements</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{job.requirements || 'No specific requirements listed.'}</p>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        {success ? (
                            <div className="text-green-400 text-center text-xl font-bold p-4 bg-green-500/10 rounded-lg">
                                Application Submitted Successfully!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Upload Resume (PDF/DOCX)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.docx,.doc"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-600 file:text-white
                                            hover:file:bg-blue-700
                                        "
                                    />
                                </div>
                                <Button
                                    onClick={handleApply}
                                    disabled={!resume || applying}
                                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {applying ? 'Submitting...' : 'Apply Now'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
