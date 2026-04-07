import PageHeader from "@/app/components/Pageheader";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {

    return (
        <div>
            <PageHeader title={"My Fridge"}/>

            <div className="flex gap-2 mb-6 items-center">
                <div className="flex items-center gap-1 border rounded-md px-2">
                    <Button variant="secondary" className="bg-transparent px-1">−</Button>
                    <span className="w-6 text-center">0</span>
                    <Button variant="secondary" className="bg-transparent px-1">+</Button>
                </div>
                <Input type="search" placeholder="Add to fridge..." className="flex-1" />
                <Button>Add</Button>
            </div>



        </div>
    );
}