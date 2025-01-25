"use client";

import {Button} from "@workspace/ui/components/button";
import {Label} from "@workspace/ui/components/label";
import {Input} from "@workspace/ui/components/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@workspace/ui/components/card";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {signInWithAuthCode} from "@/app/login/actions.server";
import {useState} from "react";


function CodePage() {
  const queryClient = useQueryClient();
  const [magicCode, setMagicCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!magicCode) return;

    const res = await signInWithAuthCode(magicCode);

    if (res.error) {
      alert('Uh oh :' + res.error);
    } else {
      await queryClient.invalidateQueries();
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="magicCode">Magic Code</Label>
                <Input
                  id="magicCode"
                  type="text"
                  placeholder="123456"
                  required
                  value={magicCode}
                  onChange={(e) => setMagicCode(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CodePage;