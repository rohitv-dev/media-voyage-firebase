import { UserService } from "@features/authentication/api/UserService";
import { Stack } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { FriendsService } from "../api/FriendsService";
import { useAuthContext } from "@/context/authContext";
import { auth } from "@/services/firebase";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQuery } from "@features/authentication/queries/authQueries";
import { useAppForm } from "@components/form/form";

export const AddFriendForm = ({ closeForm }: { closeForm: () => void }) => {
  const authCtx = useAuthContext();
  const { data: userData } = useSuspenseQuery(userQuery(authCtx.user!.uid));

  const { AppForm, AppField, SubmitButton, handleSubmit } = useAppForm({
    defaultValues: {
      text: "",
    },
    onSubmit: async ({ value }) => {
      const user = await UserService.searchUser(value.text);

      if (user) {
        const currentUser = auth.currentUser;

        if (currentUser && authCtx.user) {
          const isFriend = await FriendsService.isFriend(currentUser.uid, user.uid);

          if (isFriend) {
            showErrorNotification("You are already friends with this user, or you may have been rejected. Sad.");
            return;
          }

          await FriendsService.sendRequest({ curUid: currentUser.uid, otherUid: user.uid, username: userData.name });

          showSuccessNotification("Friend Request Sent");
          closeForm();
        }
      } else {
        showErrorNotification("User Not Found");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <AppForm>
        <Stack>
          <AppField
            name="text"
            children={({ TextField }) => (
              <TextField
                label="Name/Email"
                placeholder="Search for user by name or email"
                leftSection={<IconSearch />}
              />
            )}
          />
          <SubmitButton>Send Request</SubmitButton>
        </Stack>
      </AppForm>
    </form>
  );
};
