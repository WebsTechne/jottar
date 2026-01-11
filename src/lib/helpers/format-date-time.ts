function formatDateTime(input: string) {
  const date = new Date(input);

  // Format date as d/m/yy
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  const formattedDate = `${day}/${month}/${year}`;

  // Format time as 12-hour + am/pm
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 -> 12

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return { date: formattedDate, time: formattedTime };
}

export { formatDateTime };
