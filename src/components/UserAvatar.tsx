import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getBirthDetails } from "@/utils/storage";

export function UserAvatar() {
  const birthDetails = getBirthDetails();

  return (
    <Dialog>
      <DialogTrigger>
        <Avatar className="cursor-pointer hover:opacity-80">
          <AvatarFallback>VS</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Birth Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="font-medium">Date:</label>
            <p>{birthDetails?.date}</p>
          </div>
          <div>
            <label className="font-medium">Time:</label>
            <p>{birthDetails?.time}</p>
          </div>
          <div>
            <label className="font-medium">Location:</label>
            <p>
              {birthDetails?.latitude}°, {birthDetails?.longitude}°
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
