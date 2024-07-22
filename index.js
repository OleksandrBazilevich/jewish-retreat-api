const express = require("express");
const app = express();
const port = 5000;

// Функція для розрахунку ціни
const calculatePrice = (params) => {
  const { guest_type, room_type, occupancy, hotel_start_date, hotel_end_date } =
    params;

  // Встановимо базові ціни за номер
  const basePrices = {
    "Deluxe Room": 2,
    "One Bedroom Suite Room": 1.2, // Базова ціна за ніч
  };

  const occupancyMultiplier = {
    "Single Occupancy": 1,
    "Double Occupancy": 1.5,
  };

  const guestTypePrices = {
    adult: 50,
    teen: 30,
    child: 20,
    toddler: 10,
    infant: 0,
  };

  let days = 1; // За замовчуванням 1 день
  if (hotel_start_date[0] !== "" && hotel_end_date[0] !== "") {
    const startDate = new Date(hotel_start_date);
    const endDate = new Date(hotel_end_date);
    days = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (days < 1) days = 1; // Мінімум 1 день
  }

  let guestsPrice = {};
  let totalGuestsPrice = 0;

  for (const [type, count] of Object.entries(guest_type[0])) {
    const guestPrice =
      (guestTypePrices[type] || 0) *
      count *
      days *
      (room_type[0] !== "" ? basePrices[room_type] : 1) *
      (occupancy[0] !== "" ? occupancyMultiplier[occupancy] : 1);

    guestsPrice[type] = guestPrice;
    totalGuestsPrice += guestPrice;
  }

  return { totalPrice: totalGuestsPrice, guestsPrice };
};

// Обробник GET запиту
app.get("/calculatePrice", (req, res) => {
  const { totalPrice, guestsPrice } = calculatePrice(req.query);
  res.json({ total_price: totalPrice, guests_price: guestsPrice });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
