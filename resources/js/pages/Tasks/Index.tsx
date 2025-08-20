import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, List, Pencil, Plus, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    description?: string | null;
    is_completed: boolean;
    due_date?: string | null;
    list: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url?: string | null;
        next_page_url?: string | null;
        per_page: number;
        last_page_url?: string | null;
        first_page_url?: string | null;
    };
    lists: List[];
    filter: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksIndex({ tasks, lists, filter = { search: '', filter: 'all' }, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filter.search);
    const [completionFilter, setCompletionFilter] = useState<string>('');

    useEffect(() => {
        console.log('Tasks data (useEffect):', tasks);
    }, [tasks]);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: String(task.list.id),
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };

    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            route('tasks.index'),
            {
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(
            route('tasks.index'),
            {
                search: searchTerm,
                filter: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (pageOrUrl: number | string | null) => {
        if (!pageOrUrl) return;

        if (typeof pageOrUrl === 'number') {
            if (pageOrUrl < 1 || pageOrUrl > tasks.last_page) return;

            router.get(
                route('tasks.index'),
                {
                    page: pageOrUrl,
                    search: searchTerm,
                    filter: completionFilter,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        } else if (typeof pageOrUrl === 'string') {
            router.get(
                pageOrUrl,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-in fade-in slide-in-from-top-5`}
                    >
                        {toastType === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                        <p className="text-muted-foreground">Manage your tasks efficiently</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    setEditingTask(null);
                                    setData({
                                        title: '',
                                        description: '',
                                        due_date: '',
                                        list_id: '',
                                        is_completed: false,
                                    });
                                    setIsOpen(true);
                                }}
                                disabled={processing}
                                className="bg-lime-500 text-white duration-300 hover:bg-lime-500 hover:shadow-md"
                            >
                                <Plus className="h-4 w-4" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-xl">{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="title" className="block text-sm font-medium">
                                        Title
                                    </Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description" className="block text-sm font-medium">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="due_date" className="block text-sm font-medium">
                                        Due Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="due_date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="list_id" className="block text-sm font-medium">
                                        List
                                    </Label>
                                    <Select value={data.list_id} onValueChange={(value) => setData('list_id', value)}>
                                        <SelectTrigger
                                            id="list_id"
                                            className="mt-1 flex w-full items-center justify-between rounded-md border-gray-300 shadow-sm"
                                        >
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lists.map((list) => (
                                                <SelectItem key={list.id} value={String(list.id)}>
                                                    {list.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center">
                                    <Input
                                        type="checkbox"
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onChange={(e) => setData('is_completed', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                    />
                                    <Label htmlFor="is_completed" className="ml-2 block text-sm font-medium">
                                        Completed
                                    </Label>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {editingTask ? 'Update Task' : 'Create Task'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mb-4 flex gap-4">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </span>

                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 shadow-sm"
                        />
                    </form>

                    <Select value={completionFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-left">List</th>
                                    <th className="px-4 py-2 text-left">Due Date</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.data.map((task) => (
                                    <tr key={task.id} className="border-b hover:bg-accent">
                                        <td className="px-4 py-2" title={task.title}>
                                            {task.title.length > 20 ? `${task.title.slice(0, 20)}...` : task.title}
                                        </td>
                                        <td className="px-4 py-2" title={task.description || 'N/A'}>
                                            {task.description
                                                ? task.description.length > 50
                                                    ? `${task.description.slice(0, 50)}...`
                                                    : task.description
                                                : 'N/A'}
                                        </td>
                                        <td className="flex flex-row items-center gap-2 px-4 py-2 whitespace-nowrap">
                                            <List className="h-3 w-3" />
                                            {task.list.title}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-row items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {task.due_date
                                                    ? new Date(task.due_date).toLocaleDateString('en-US', {
                                                          month: 'numeric',
                                                          day: 'numeric',
                                                          year: 'numeric',
                                                      })
                                                    : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.is_completed ? (
                                                <span className="text-lime-500">Completed</span>
                                            ) : (
                                                <span className="text-yellow-500">Pending</span>
                                            )}
                                        </td>
                                        <td className="flex justify-end space-x-4 px-4 py-2">
                                            <Pencil className="h-4 w-4 cursor-pointer" onClick={() => handleEdit(task)} aria-label="Edit Task" />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <span>
                                                        <Trash2 className="h-4 w-4 cursor-pointer text-destructive" aria-label="Delete Task" />
                                                    </span>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Confirm Delete</DialogTitle>
                                                    <div className="py-2">Are you sure you want to delete this task?</div>
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="destructive" onClick={() => handleDelete(task.id)}>
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    {tasks.data.length === 0 && (
                                        <td colSpan={6} className="px-4 py-2 text-center">
                                            No tasks found
                                        </td>
                                    )}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between">
                    <p className="text-xs text-gray-600">
                        Showing {tasks.from} - {tasks.to} of {tasks.total} results
                    </p>
                    {/* Pagination */}
                    <div className="flex items-center justify-between gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(tasks.prev_page_url)} disabled={!tasks.prev_page_url}>
                            <ChevronLeft className="mr-1 h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-600">
                            Page {tasks.current_page} of {tasks.last_page}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(tasks.next_page_url)} disabled={!tasks.next_page_url}>
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
