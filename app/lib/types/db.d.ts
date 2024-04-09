type User = {
  name: string;
  email: string;
  image: string;
  id: string;
  username?: string;
};

type chat = {
  id: string;
  messages: Message[];
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
};

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  senderMail: string;
};
