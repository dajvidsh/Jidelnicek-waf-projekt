import PageHeader from "@/app/components/Pageheader";
import { Checkbox } from "@/components/ui/checkbox";
import RecipeActions from "./RecipeActions";

interface RecipeDetailInfo {
    id: number;
    title: string;
    image: string;
    instructions: string;
    extendedIngredients: {
        id: number;
        original: string;
    }[];
    analyzedInstructions: {
        name: string;
        steps: {
            number: number;
            step: string;
        }[];
    }[];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        return <div className="p-10 text-center">Recipe not found.</div>;
    }

    const recipeDetail: RecipeDetailInfo = await res.json();

    return (
        <div className="bg-white min-h-screen pb-10">

            <PageHeader title={recipeDetail.title} />

            <div className="max-w-3xl mx-auto px-6">

                <RecipeActions id={id} />

                <div className="w-full mb-8 rounded-2xl overflow-hidden bg-slate-50 shadow-sm">
                    <img
                        src={recipeDetail.image}
                        alt={recipeDetail.title}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                </div>

                <div className="mb-10 flex flex-col gap-4">
                    {recipeDetail.extendedIngredients?.map((ingredient, index) => (
                        <div key={`${ingredient.id}-${index}`}>
                            <label className="flex items-center space-x-3 text-primary font-bold text-sm md:text-base cursor-pointer">
                                <Checkbox className="border-primary text-primary w-5 h-5"/>
                                <span>{ingredient.original}</span>
                            </label>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-primary font-bold text-lg mb-4">Instructions</h3>

                    {recipeDetail.instructions ? (
                        <div
                            className="text-slate-700 text-sm md:text-base leading-relaxed
                           [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-5 [&_ol]:space-y-2
                           [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ul]:space-y-2
                           [&_li]:pl-1
                           [&_p]:my-3
                           [&_strong]:font-bold [&_strong]:text-slate-900"
                            dangerouslySetInnerHTML={{ __html: recipeDetail.instructions }}
                        />
                    ) : (
                        <p className="text-slate-400 italic text-sm">No instructions available for this recipe.</p>
                    )}
                </div>

            </div>
        </div>
    );
}