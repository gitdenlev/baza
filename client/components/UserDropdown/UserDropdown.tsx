import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut, Settings, Sun, User as UserIcon } from "lucide-react";
import { getProfile } from "@/lib/user.api";
import { removeTokens } from "@/lib/auth";
import axios from "axios";
import { API_URL } from "@/lib/api";

type UserProfile = {
  id: string;
  email: string;
  name: string | null;
};

export function UserDropdown() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getProfile();
      if (profile) {
        setUser(profile);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (user) {
      try {
        await axios.post(`${API_URL}/auth/logout`, { userId: user.id });
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
    removeTokens();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserIcon size={16} />
          <span>My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
