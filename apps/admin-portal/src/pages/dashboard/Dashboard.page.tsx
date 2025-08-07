import { usePropositionsQuery } from "../../hooks/propositons/queries";

export const DashboardPage = () => {
    const { data, isLoading } = usePropositionsQuery();

    if (isLoading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div>
            <h1>Welcome to Dashboard</h1>
            <div>
                <ul>
                    {JSON.stringify(data)}
                </ul>
            </div>
        </div>
    )
}