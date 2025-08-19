import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AlertCircle, CheckCircle, List, ListTodo } from 'lucide-react';
dayjs.extend(relativeTime);

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Activity = {
    id: number | string;
    title: string;
    is_completed: boolean;
    updated_at: string;
};

export default function Dashboard({
    stats = { totalLists: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 },
    recentActivities = [],
}: Props & { recentActivities?: Activity[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your task management</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-purple-500 bg-purple-500/10 text-purple-500 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-md font-medium text-purple-500">Total Lists</CardTitle>
                            <div className="rounded-lg bg-purple-500 p-2">
                                <List className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold">{stats?.totalLists ?? 0}</p>
                            <p className="text-xs text-gray-500">Total lists created</p>
                        </CardContent>
                    </Card>

                    <Card className="border-lime-500 bg-lime-500/10 text-lime-500 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-md font-medium text-lime-500">Total Tasks</CardTitle>
                            <div className="rounded-lg bg-lime-500 p-2">
                                <ListTodo className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold">{stats?.totalTasks ?? 0}</p>
                            <p className="text-xs text-gray-500">Total tasks across all lists</p>
                        </CardContent>
                    </Card>

                    <Card className="border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-md font-medium text-yellow-500">Pending Tasks</CardTitle>
                            <div className="rounded-lg bg-yellow-500 p-2">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold">{stats?.pendingTasks ?? 0}</p>
                            <p className="text-xs text-gray-500">Tasks that are not yet completed</p>
                        </CardContent>
                    </Card>

                    <Card className="border-teal-500 bg-teal-500/10 text-teal-500 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-md font-medium text-teal-500">Completed Tasks</CardTitle>
                            <div className="rounded-lg bg-teal-500 p-2">
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold">{stats?.completedTasks ?? 0}</p>
                            <p className="text-xs text-gray-500">Tasks that have been completed</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col items-stretch justify-between gap-6 lg:flex-row">
                    <Card className="flex w-full flex-col border-gray-300 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight">Quick Actions</CardTitle>
                            <p className="text-sm text-gray-500">Add new tasks or lists quickly.</p>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="mb-4 flex flex-col gap-2">
                                <Link href="/lists" className="box-border w-full max-w-full flex-col rounded-lg border px-3 py-2 text-sm shadow-sm">
                                    <List className="mr-2 inline-block h-4 w-4" />
                                    <span>View all Lists</span>
                                </Link>
                                <Link href="/tasks" className="box-border w-full max-w-full flex-col rounded-lg border px-3 py-2 text-sm shadow-sm">
                                    <ListTodo className="mr-2 inline-block h-4 w-4" />
                                    <span>View all Tasks</span>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex w-full flex-col border-gray-300 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight">Recent Activity</CardTitle>
                            <p className="text-sm text-gray-500">Your recent activities in the application.</p>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div>
                                <ul>
                                    {(recentActivities ?? []).length > 0 ? (
                                        (recentActivities ?? []).map((activity: Activity) => (
                                            <li key={activity.id} className="mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex h-2 w-2 rounded-full ${
                                                            activity.is_completed ? 'bg-teal-500' : 'bg-yellow-500'
                                                        }`}
                                                        title={activity.is_completed ? 'Completed' : 'Pending'}
                                                    />
                                                    <span>{activity.title.length > 12 ? activity.title.slice(0, 12) + '…' : activity.title}</span>
                                                    <span className="ml-auto text-xs text-gray-400">
                                                        {activity.is_completed ? 'Completed' : 'Pending'} &middot;{' '}
                                                        {dayjs(activity.updated_at).fromNow()}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex h-16 items-center justify-center text-center text-sm text-gray-400">
                                            No recent activity.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
