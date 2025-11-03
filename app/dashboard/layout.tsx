"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useMemo, ReactNode} from "react";
import {useUserContext} from "@/contexts/UserContext";
import {setAxiosToken} from "@/lib/axios";
import CustomRadio from "@/components/form/CustomRadio";
import {DASHBOARD_TABS} from "@/lib/dashboardTabs";
import ModalRoot from "@/components/ModalRoot";
import {ThemeToggle} from "@/components/ThemeToggle";

const active = "text-fuchsia-600 border-fuchsia-600 active dark:text-blue-500 dark:border-fuchsia-500";
const inactive = "border-transparent hover:border-gray-300 dark:hover:text-gray-300";

export default function DashboardLayout({children}: { children: ReactNode }) {
    const {user, logout, shift, setShift} = useUserContext();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setAxiosToken(user?.token || null);
    }, [user]);

    const tabs = useMemo(
        () => (user ? DASHBOARD_TABS.filter(t => t.roles.includes(user.role)) : []),
        [user]
    );

    useEffect(() => {
        if (pathname === "/dashboard" && tabs[0]) router.replace(tabs[0].path);
    }, [pathname, tabs, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl mx-6 mt-6">{process.env.NEXT_PUBLIC_APP_TITLE}</h1>
                <div className="mx-6 mt-4 flex gap-2 items-center">
                    <ThemeToggle/>
                    <div className="flex gap-1 border rounded-lg py-2 px-3 text-xs mr-6">
                        <CustomRadio size={4} label="Morning shift" value="morning" groupValue={shift}
                                     onChange={setShift}/>
                        <CustomRadio size={4} label="Evening shift" value="evening" groupValue={shift}
                                     onChange={setShift}/>
                    </div>
                    <span className="mr-3">Welcome {user.name}</span>
                    <button className="" onClick={logout}>Logout</button>
                </div>
            </header>

            <div className="mx-4 my-6 p-4 border rounded-lg">
                <nav className="font-medium text-center border-b">
                    <ul className="flex flex-wrap -mb-px">
                        {tabs.map(t => {
                            const isActive = pathname === t.path || pathname?.startsWith(`${t.path}/`);
                            return (
                                <li className="me-2" key={t.id}>
                                    <Link href={t.path}
                                          className={`inline-block p-4 border-b-2 rounded-t-lg ${isActive ? active : inactive}`}>
                                        {t.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-2 pt-4">{children}</div>
            </div>

            <footer className="text-center mt-4 text-gray-500 pt-3 pb-9">
                <span className="mr-3">{process.env.NEXT_PUBLIC_APP_ADDRESS}</span>
                <span className="mr-3">Telephone: {process.env.NEXT_PUBLIC_APP_TELEPHONE}</span>
                <span className="mr-3">Fax: {process.env.NEXT_PUBLIC_APP_FAX}</span>
                <span className="mr-3">Email: {process.env.NEXT_PUBLIC_APP_EMAIL}</span>
            </footer>
            <ModalRoot/>
        </div>
    );
}
