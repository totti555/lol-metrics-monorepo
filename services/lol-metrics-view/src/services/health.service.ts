export const getHealth = async () => {
  const res = await fetch("http://localhost:3001/health");
  if (!res.ok) throw new Error("API offline");
  return res.json();
};
