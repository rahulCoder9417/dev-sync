"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Clock, UserCheck, UserCircle, UserPlus } from 'lucide-react';
import { showToast } from '../main/Toast';
import { useAppSelector } from '@/lib/redux/hooks';

const FriendshipButton = ({status,userId}: {status: string,userId:string}) => {
    const {id} = useAppSelector(
      (state) => state.user,
    );
    const [friendshipStatus, setFriendshipStatus] = React.useState(status);// accepted pending none acceptHim
     const handleFriendshipAction = async() => {
          if (friendshipStatus === "none") {
          const res  =   await fetch("/api/friend/toggle", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
                action: "request",
              }),
            });
              setFriendshipStatus("pending");
            
          } else if (friendshipStatus === "accepted") {
            await fetch("/api/friend/toggle", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
                action: "reject",
              }),
            });
            setFriendshipStatus("none");
            return;
          } else if (friendshipStatus === "acceptHim") {
           await fetch("/api/friend/toggle", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              action: "accept",
            }),
          });
          setFriendshipStatus("accepted");
          }
        };
      const deleteRequest = async()=>{
        await fetch("/api/friend/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            action: "reject",
          }),
        });
        setFriendshipStatus("none");
      }
        const getFriendshipButton = () => {
          switch (friendshipStatus) {
            case "none":
              return {
                icon: <UserPlus className="w-4 h-4" />,
                text: "Add Friend",
                variant: "default",
              };
            case "pending":
              return {
                icon: <Clock className="w-4 h-4" />,
                text: "Pending",
                variant: "outline",
              };
            case "accepted":
              return {
                icon: <UserCheck className="w-4 h-4" />,
                text: "Friends",
                variant: "default",
              };
            case "acceptHim":
              return {
                icon: <UserCheck className="w-4 h-4" />,
                text: "Accept",
                variant: "default",
              };
          }
        };
      
        const buttonConfig = getFriendshipButton();
        if(id === userId){
          return null
        }
  return (
    <div className=''>
     <Button
     disabled={friendshipStatus === "pending"}
                    onClick={handleFriendshipAction}
                    variant={buttonConfig?.variant! as any}
                    className="gap-2 font-semibold mr-2 cursor-pointer transition-all"
                  >
                    {buttonConfig?.icon}
                    {buttonConfig?.text}
                  </Button> 
                  
                 { friendshipStatus === "acceptHim" && <Button
                    onClick={deleteRequest}
                    variant={"outline"}
                    className="gap-2 font-semibold cursor-pointer transition-all"
                  >
                    <UserCircle className="w-4 h-4" />
                    Remove 
                  </Button>}
                  </div>
  )
}

export default FriendshipButton
