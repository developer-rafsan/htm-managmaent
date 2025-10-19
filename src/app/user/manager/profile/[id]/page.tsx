export default async function UserProfile({params,}: {params: Promise<{ id: string }>}) {
    const { id } = await params;

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold">Profile manager Page</h1>
            <p className="mt-2">
                User ID:{" "}
                <span className="p-2 ml-2 rounded bg-orange-500 text-black">{id}</span>
            </p>
        </div>
    );
}