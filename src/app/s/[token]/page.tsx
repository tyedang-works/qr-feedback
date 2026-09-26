import SurveyForm from "@/components/survey/SurveyForm";

type SurveyPageProps = {
    params: Promise<{
        token: string;
    }>;
};

export default async function SurveyPage({
    params,
}: SurveyPageProps) {
    const { token } = await params;

    return <SurveyForm tableToken={token} />;
}