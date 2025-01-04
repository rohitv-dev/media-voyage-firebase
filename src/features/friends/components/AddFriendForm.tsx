import { auth } from "@/services/firebase";
import { User } from "@/types/user";
import { UserService } from "@features/authentication/api/UserService";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { useState } from "react";
import { FriendsService } from "../api/FriendsService";

export const AddFriendForm = ({ closeForm }: { closeForm: () => void }) => {
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const res = await UserService.searchUser(text);

    if (res.ok) {
      setUser(res.data);
      showSuccessNotification("User Found, click on Send Request to send a friend request");
    } else {
      showErrorNotification(res.message);
    }
  };

  const sendRequest = async () => {
    const currentUser = auth.currentUser;

    if (user && currentUser) {
      const isFriendRes = await FriendsService.isFriend(currentUser.uid, user.uid);

      if (!isFriendRes.ok) {
        showErrorNotification(isFriendRes.message);
        return;
      }

      if (isFriendRes.data) {
        showErrorNotification("You are already friends with this user, or you may have been rejected. Sad.");
        return;
      }

      const res = await FriendsService.sendRequest(currentUser.uid, user.uid);

      if (res.ok) {
        showSuccessNotification("Friend Request Sent");
        closeForm();
      } else showErrorNotification(res.message);
    }
  };

  return (
    <>
      <Stack>
        <TextInput
          label="Name/Email"
          placeholder="Search for user by name or email"
          leftSection={<IconSearch />}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <Group grow>
          <Button variant="outline" onClick={fetchUser}>
            Fetch User
          </Button>
          <Button onClick={sendRequest} disabled={!user}>
            Send Request
          </Button>
        </Group>
      </Stack>
    </>
  );
};
