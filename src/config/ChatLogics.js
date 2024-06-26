export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);
try {
  

  if (
    i < messages.length - 1 &&
    messages[i + 1].user.id === m.user.id &&
    messages[i].user.id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].user.id !== m.user.id &&
      messages[i].user.id !== userId) ||
    (i === messages.length - 1 && messages[i].user.id !== userId)
  )
    return 0;
  else return "auto";
} catch (error) {
  
}
};

export const isSameSender = (messages, m, i, userId) => {
  try {
  return (
     
    i < messages.length - 1 &&
    (messages[i + 1]?.user?.id !== m?.user?.id ||
      messages[i + 1]?.user?.id === undefined) &&
    messages[i]?.user?.id !== userId
  );
}
catch (error) {
      
  }
};

export const isLastMessage = (messages, i, userId) => {
  try {
    
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].user.id !== userId &&
    messages[messages.length - 1].user.id
  );
} catch (error) {
    
}
};

export const isSameUser = (messages, m, i) => {
  try {
    
  return i > 0 && messages[i - 1].user.id === m.user.id;
} catch (error) {
    
}
};

export const getSender = (loggedUser, users) => {
  return users[0]?.id === loggedUser?.id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0].id === loggedUser.id ? users[1] : users[0];
};
