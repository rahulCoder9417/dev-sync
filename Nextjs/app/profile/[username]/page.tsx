import Link from 'next/link';

import Avatar from '@/components/main/Avatar';
import { ProjectCard } from '@/components/project/ProjectCard';
import FriendshipButton from '@/components/profile/FriendshipButton';

import { getUserDetails } from '@/lib/actions/user/userDetailes';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}


/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default async function Page({ params }: PageProps) {
  const { username } = await params;

  const data = await getUserDetails(username);
  if (!data.success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
       USER NOT FOUND ==== {data.error}
      </div>
    );
  }
  const user= data.user || null;

  

  return (
    <div className="min-h-screen flex-1 bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <section className="rounded-2xl p-8 mb-8 border border-primary card-gradient">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar
              className="!w-20 !h-20 !text-3xl !font-bold"
              username={user.username}
              fullName={user.fullName}
              avatar={user.avatar}
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-1">
                    {user.fullName}
                  </h1>
                  <p className="text-lg text-muted">
                    @{user.username}
                  </p>
                </div>

                {/* Friendship Action */}
                <FriendshipButton
                  status={user.isFriend}
                  userId={user.id}
                />
              </div>

              {user.bio && (
                <p className="mb-6 max-w-2xl text-muted">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-20">
                <Stat label="Projects" value={user.projects.length} />
                <Stat label="Friends" value={user.totalFriends} />
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Projects
          </h2>

          {user.projects.length === 0 ? (
            <div className="text-muted">
              No public projects available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {user.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                >
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Subcomponents                                */
/* -------------------------------------------------------------------------- */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-2xl font-bold text-primary">
        {value}
      </div>
      <div className="text-muted">{label}</div>
    </div>
  );
}
