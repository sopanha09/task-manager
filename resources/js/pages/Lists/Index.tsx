import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { CheckCircle, Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface List {
    id: number;
    title: string;
    description: string | null;
    tasks_count?: number;
}

interface Props {
    lists: List[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    },
];

export default function ListsIndex({ lists, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingList) {
            put(route('lists.update', editingList.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        } else {
            post(route('lists.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (list: List) => {
        setEditingList(list);
        setData({
            title: list.title,
            description: list.description || '',
        });
        setIsOpen(true);
    };

    const handleDelete = (listId: number) => {
        destroy(route('lists.destroy', listId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lists" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-danger'} text-white animate-in fade-in slide-in-from-top-5`}
                    >
                        {toastType === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
                        <p className="text-muted-foreground">Manage your task lists</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    setEditingList(null);
                                    setData({
                                        title: '',
                                        description: '',
                                    });
                                    setIsOpen(true);
                                }}
                                className="bg-lime-500 text-white duration-300 hover:bg-lime-500 hover:shadow-md"
                            >
                                <Plus className="h-4 w-4" />
                                New List
                            </Button>
                        </DialogTrigger>
                        {isOpen && (
                            <DialogContent>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <DialogTitle className="text-xl font-medium">{editingList ? 'Edit List' : 'Create New List'}</DialogTitle>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            type="text"
                                            placeholder="Title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="rounded border px-2 py-1"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            placeholder="Description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="rounded border px-2 py-1"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button className="bg-lime-500 hover:bg-lime-500" type="submit" disabled={processing}>
                                            {editingList ? 'Update' : 'Create'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        )}
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {lists.map((list) => (
                        <div key={list.id} className="flex w-full max-w-full flex-col rounded-lg border border-gray-300 p-4 shadow-sm">
                            <div className="w-full">
                                <div className="mb-4 flex flex-row items-center justify-between gap-4">
                                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold">{list.title}</h3>
                                    <div className="flex flex-row items-center gap-3">
                                        <Pencil className="h-4 w-4 cursor-pointer" onClick={() => handleEdit(list)} />
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Trash2 className="h-4 w-4 cursor-pointer text-destructive" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <div className="flex flex-col gap-4">
                                                    <h3 className="text-lg font-semibold">Delete List</h3>
                                                    <p>Are you sure you want to delete this list? This action cannot be undone.</p>
                                                    <div className="flex justify-end gap-2">
                                                        <Button className="bg-danger" variant="destructive" onClick={() => handleDelete(list.id)}>
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <p className="line-clamp-2 w-full text-sm break-words text-gray-600">{list.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
