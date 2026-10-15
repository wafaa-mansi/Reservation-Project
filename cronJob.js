import cron from "node-cron";

const url = "http://localhost:3000/book";

async function bookRoom(userId) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        roomId: "101",
        bookingDate: "2026-10-20T11:00:00+03:00"
      })
    });

    const data = await response.json();

    console.log(userId, response.status, data.message);

    return response.status;
  } catch (error) {
    console.error(userId, error.message);
    return null;
  }
}

const task = cron.schedule("* * * * *", async () => {
  task.stop();

  console.log("Sending simultaneous booking requests...");

  const results = await Promise.all([
    bookRoom("User2"),
    bookRoom("User3")
  ]);

  console.log("Results:", results);

  const success = results.filter(status => status === 201).length;
  const conflicts = results.filter(status => status === 409).length;

  console.log(
    success === 1 && conflicts === 1
      ? "TEST PASSED"
      : "TEST FAILED"
  );
});

console.log("Cron job scheduled.");