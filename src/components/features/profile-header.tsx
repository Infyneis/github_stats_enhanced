"use client";

import { GitHubUser } from "@/types/github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  Link as LinkIcon,
  Calendar,
  Users,
  GitFork,
} from "lucide-react";
import { format } from "date-fns";

interface ProfileHeaderProps {
  user: GitHubUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const joinDate = format(new Date(user.created_at), "MMMM yyyy");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border p-6 md:p-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
          <Avatar className="relative h-28 w-28 md:h-32 md:w-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback className="text-2xl">
              {user.login.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {user.name || user.login}
            </h1>
            <Badge variant="secondary" className="w-fit mx-auto md:mx-0">
              @{user.login}
            </Badge>
          </div>

          {user.bio && (
            <p className="text-muted-foreground mb-4 max-w-xl">{user.bio}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            {user.company && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{user.company}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <LinkIcon className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex justify-center md:justify-start gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{user.followers.toLocaleString()}</span>
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{user.following.toLocaleString()}</span>
              <span className="text-muted-foreground">following</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{user.public_repos}</span>
              <span className="text-muted-foreground">repos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
