"use client";

import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import api from "@/lib/axios";
import {useRouter} from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await api.post("/logout");
        router.push("/login");
    }

    return (
        <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2"/> Logout
        </Button>
    );
}
