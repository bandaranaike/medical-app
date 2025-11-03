import React, {FormEvent, useState} from "react";
import TextInput from "@/components/form/TextInput";
import axios from "@/lib/axios";
import {LoggedUser} from "@/types/interfaces";
import CustomCheckbox from "@/components/form/CustomCheckbox";
import {motion} from "framer-motion"
import {AlertCircle, Loader2, LogIn} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

interface LoginWindowProps {
    onUserHasLoggedIn: (loggedUser: LoggedUser) => void;
}

const LoginWindow: React.FC<LoginWindowProps> = ({onUserHasLoggedIn}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const errors: string[] = []; // Initialize an array to collect errors

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.push("Email is required.");
        } else if (!emailRegex.test(email)) {
            errors.push("Invalid email format.");
        }

        // Validate password strength
        if (!password) {
            errors.push("Password is required.");
        }

        setLoginError(errors.length > 0 ? errors.join(", ") : null);

        // Return true if no errors
        return errors.length === 0;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            try {
                axios.post('login', {email, password}).then(loginResponse => {
                    onUserHasLoggedIn(loginResponse.data);
                }).catch(e => {
                    if (e.status == 401) {
                        setLoginError('Email or password does not match.')
                    } else {
                        setLoginError(e.message);
                    }
                }).finally(() => setLoading(false));
            } catch (error) {
                console.error(error)
                setLoginError('An error occurred. Please try again later.')
                setLoading(false);
            }
        }

    };

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4}}
                >
                    <Card className="w-[380px] shadow-xl border border-border/50 bg-card backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-semibold">
                                Welcome Back
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {loginError && (
                                    <div
                                        className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                                        <AlertCircle className="h-4 w-4"/>
                                        <span>{loginError}</span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full mt-2"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2"/>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="h-4 w-4 mr-2"/>
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    )
}

export default LoginWindow;