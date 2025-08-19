import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, List, ListTodo } from 'lucide-react';

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

export default function Dashboard({ stats = { totalLists: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 } }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your task management</p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Lists</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{stats?.totalLists ?? 0}</span>
                            <List className="h-6 w-6 text-primary" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{stats?.totalTasks ?? 0}</span>
                            <ListTodo className="h-6 w-6 text-primary" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{stats?.completedTasks ?? 0}</span>
                            <CheckCircle className="text-success h-6 w-6" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{stats?.pendingTasks ?? 0}</span>
                            <AlertCircle className="text-warning h-6 w-6" />
                        </CardContent>
                    </Card>
                </div>

                {stats ? (
                    <>
                        {/* Additional stats or components can be added here */}
                        {/* Add quick Action and Recent Activity below */}
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold">Quick Actions</h2>
                            <p className="text-muted-foreground">Create new lists or tasks quickly</p>
                            {/* Add quick action buttons here */}
                            <div className="mt-4 flex gap-4">
                                <Button onClick={() => (window.location.href = '/lists')}>Create List</Button>
                                <Button onClick={() => (window.location.href = '/tasks')}>Create Task</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <PlaceholderPattern />
                )}
            </div>
        </AppLayout>
    );
}
