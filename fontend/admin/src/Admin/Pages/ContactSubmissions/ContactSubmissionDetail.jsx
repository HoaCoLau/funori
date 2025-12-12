import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const ContactSubmissionDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    const fetchSubmission = async () => {
        try {
            const response = await api.get(`/contact-submissions/${id}`);
            const data = response.data.data;
            setSubmission(data);
            setStatus(data.status);
        } catch (error) {
            console.error('Error fetching submission:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await api.put(`/contact-submissions/${id}`, { status });
            toast.success('Status updated successfully');
            navigate('/contact-submissions');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim()) {
            toast.error('Please enter a reply message');
            return;
        }

        if (!window.confirm('Are you sure you want to send this reply?')) return;

        setSendingReply(true);
        try {
            await api.post(`/contact-submissions/${id}/reply`, { message: replyMessage });
            toast.success('Reply sent successfully');
            setReplyMessage('');
            fetchSubmission(); // Refresh to see updated status
        } catch (error) {
            console.error('Error sending reply:', error);
            toast.error('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    if (loading) return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <Skeleton className="w-8 h-8 rounded-full mr-4" />
                <Skeleton className="h-8 w-48" />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-6" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
    if (!submission) return <div className="p-6">Submission not found</div>;

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/contact-submissions')}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Submission Details</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <div className="mt-1 text-lg text-gray-900">{submission.full_name}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <div className="mt-1 text-lg text-gray-900">{submission.email}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                        <div className="mt-1 text-lg text-gray-900">{submission.phone || 'N/A'}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Date</label>
                        <div className="mt-1 text-lg text-gray-900">{submission.created_at || 'N/A'}</div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500">Subject</label>
                    <div className="mt-1 text-lg text-gray-900 font-medium">{submission.subject}</div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500">Message</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap">
                        {submission.message_content}
                    </div>
                </div>

                {/* Reply Section */}
                <div className="mb-6 border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Reply to User</h3>
                    <div className="mb-4">
                        <textarea
                            rows="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Type your reply here..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        onClick={handleSendReply}
                        disabled={sendingReply}
                        className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
                            sendingReply ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>

                <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <div className="flex items-center space-x-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>
                        <button
                            onClick={handleStatusUpdate}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={18} className="mr-2" />
                            Update Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSubmissionDetail;
