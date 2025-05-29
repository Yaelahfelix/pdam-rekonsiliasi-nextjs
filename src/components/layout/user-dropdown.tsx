import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"

import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserDropdown() {
  const session = useSession()
  const user = session.data?.user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="User"
        >
          <Avatar className="size-9">
            {/* <AvatarImage src={userData?.avatar} alt="" /> */}
            <AvatarFallback className="bg-transparent">
              {user?.nama && getInitials(user.nama)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount>
        <DropdownMenuLabel className="flex gap-2">
          <Avatar>
            <AvatarFallback className="bg-transparent">
              {user?.nama && getInitials(user.nama)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.nama}</p>
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {user?.username}
            </p>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup className="max-w-48">
          {/* <DropdownMenuItem asChild>
            <Link href="/">
              <User className="me-2 size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">
              <UserCog className="me-2 size-4" />
              Settings
            </Link>
          </DropdownMenuItem> 
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
          <LogOut className="me-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
