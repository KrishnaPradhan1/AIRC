'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function PostJobPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        deadline: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createJob(formData);
            router.push('/dashboard/recruiter');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to post job');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-md border-white/20 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center">Post a New Job</h1>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <Input
                            name="title"
                            placeholder="e.g. Senior Software Engineer"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Job description..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full h-32 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Requirements</label>
                        <textarea
                            name="requirements"
                            placeholder="Key skills and requirements..."
                            value={formData.requirements}
                            onChange={handleChange}
                            className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <Input
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Post Job
                    </Button>
                </form>
            </Card>
        </div>
    );
}
