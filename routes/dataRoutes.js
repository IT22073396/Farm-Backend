// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const Temperature = require('../models/temperatureModel');
// const Aveminuts = require('../models/AveMinut');
// const Avehours = require('../models/AveHour');
// const Avedays = require('../models/AveDay');
// const ProcessedData = require('../models/ProcessedData');

// const ESP32_URL = 'http://192.168.8.102/sensor-temperature';

// let intervalId = null;
// let minuteCounter = 0;
// let hourCounter = 0;

// router.post('/start-process', async (req, res) => {
//   try {
//     if (intervalId) return res.status(400).json({ message: 'Process is already running' });

//     intervalId = setInterval(async () => {
//       try {
//         const response = await axios.get(ESP32_URL);
//         if (response.status === 200) {
//           const { temperature, humidity, soil_moisture, height } = response.data;
//           await Temperature.create({ temperature, humidity, soil_moisture, height });

//           const count = await Temperature.countDocuments();
//           if (count >= 60) {
//             const all = await Temperature.find();
//             const avg = all.reduce((acc, e) => {
//               acc.temperature += e.temperature;
//               acc.humidity += e.humidity;
//               acc.soil_moisture += e.soil_moisture;
//               acc.height += e.height;
//               return acc;
//             }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

//             const averageMinute = {
//               temperature: avg.temperature / count,
//               humidity: avg.humidity / count,
//               soil_moisture: avg.soil_moisture / count,
//               height: avg.height / count
//             };

//             await Aveminuts.create(averageMinute);
//             await Temperature.deleteMany();
//             minuteCounter++;

//             if (minuteCounter >= 60) {
//               const minutes = await Aveminuts.find();
//               const hourly = minutes.reduce((acc, e) => {
//                 acc.temperature += e.temperature;
//                 acc.humidity += e.humidity;
//                 acc.soil_moisture += e.soil_moisture;
//                 acc.height += e.height;
//                 return acc;
//               }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

//               const averageHour = {
//                 temperature: hourly.temperature / minuteCounter,
//                 humidity: hourly.humidity / minuteCounter,
//                 soil_moisture: hourly.soil_moisture / minuteCounter,
//                 height: hourly.height / minuteCounter
//               };

//               await Avehours.create(averageHour);
//               await Aveminuts.deleteMany();
//               minuteCounter = 0;
//               hourCounter++;

//               if (hourCounter >= 24) {
//                 const hours = await Avehours.find();
//                 const daily = hours.reduce((acc, e) => {
//                   acc.temperature += e.temperature;
//                   acc.humidity += e.humidity;
//                   acc.soil_moisture += e.soil_moisture;
//                   acc.height += e.height;
//                   return acc;
//                 }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

//                 const averageDay = {
//                   temperature: daily.temperature / hourCounter,
//                   humidity: daily.humidity / hourCounter,
//                   soil_moisture: daily.soil_moisture / hourCounter,
//                   height: daily.height / hourCounter
//                 };

//                 await Avedays.create(averageDay);
//                 await Avehours.deleteMany();
//                 hourCounter = 0;

//                 const dayCount = await Avedays.countDocuments();
//                 if (dayCount >= 8) {
//                   const days = await Avedays.find();
//                   const processed = days.reduce((acc, e) => {
//                     acc.temperature += e.temperature;
//                     acc.humidity += e.humidity;
//                     acc.soil_moisture += e.soil_moisture;
//                     acc.height += e.height;
//                     return acc;
//                   }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

//                   await ProcessedData.create({
//                     temperature: processed.temperature / dayCount,
//                     humidity: processed.humidity / dayCount,
//                     soil_moisture: processed.soil_moisture / dayCount,
//                     height: processed.height / dayCount
//                   });

//                   await Avedays.deleteMany();
//                   clearInterval(intervalId);
//                   intervalId = null;
//                   console.log('8 days processed. Process ended.');
//                 }
//               }
//             }
//           }
//         }
//       } catch (err) {
//         console.error('Fetch/store error:', err);
//       }
//     }, 1000);

//     res.status(200).json({ message: 'Process started' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal error' });
//   }
// });

// router.post('/stop-process', async (req, res) => {
//   try {
//     if (!intervalId) return res.status(400).json({ message: 'No process running' });
//     clearInterval(intervalId);
//     intervalId = null;
//     await Temperature.deleteMany();
//     await Aveminuts.deleteMany();
//     await Avehours.deleteMany();
//     await Avedays.deleteMany();
//     res.status(200).json({ message: 'Process stopped and data cleared' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error stopping process' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Temperature = require('../models/temperatureModel');
const Aveminuts = require('../models/AveMinut');
const Avehours = require('../models/AveHour');
const Avedays = require('../models/AveDay');
const ProcessedData = require('../models/ProcessedData');

const ESP32_URL = 'http://192.168.8.102/sensor-temperature';

let intervalId = null;
let minuteCounter = 0;
let hourCounter = 0;

// POST /start-process
router.post('/start-process', async (req, res) => {
  try {
    if (intervalId) return res.status(400).json({ message: 'Process is already running' });

    intervalId = setInterval(async () => {
      try {
        // Fetch data from ESP32
        const response = await axios.get(ESP32_URL);
        if (response.status === 200) {
          const { temperature, humidity, soil_moisture, height } = response.data;

          // Save raw data to Temperature collection
          await Temperature.create({ temperature, humidity, soil_moisture, height });

          // Process minute-level averages
          const count = await Temperature.countDocuments();
          if (count >= 60) {
            const all = await Temperature.find();
            const avg = all.reduce((acc, e) => {
              acc.temperature += e.temperature;
              acc.humidity += e.humidity;
              acc.soil_moisture += e.soil_moisture;
              acc.height += e.height;
              return acc;
            }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

            const averageMinute = {
              temperature: avg.temperature / count,
              humidity: avg.humidity / count,
              soil_moisture: avg.soil_moisture / count,
              height: avg.height / count
            };

            await Aveminuts.create(averageMinute);
            await Temperature.deleteMany();
            minuteCounter++;

            // Process hourly averages
            if (minuteCounter >= 60) {
              const minutes = await Aveminuts.find();
              const hourly = minutes.reduce((acc, e) => {
                acc.temperature += e.temperature;
                acc.humidity += e.humidity;
                acc.soil_moisture += e.soil_moisture;
                acc.height += e.height;
                return acc;
              }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

              const averageHour = {
                temperature: hourly.temperature / minuteCounter,
                humidity: hourly.humidity / minuteCounter,
                soil_moisture: hourly.soil_moisture / minuteCounter,
                height: hourly.height / minuteCounter
              };

              await Avehours.create(averageHour);
              await Aveminuts.deleteMany();
              minuteCounter = 0;
              hourCounter++;

              // Process daily averages
              if (hourCounter >= 24) {
                const hours = await Avehours.find();
                const daily = hours.reduce((acc, e) => {
                  acc.temperature += e.temperature;
                  acc.humidity += e.humidity;
                  acc.soil_moisture += e.soil_moisture;
                  acc.height += e.height;
                  return acc;
                }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

                const averageDay = {
                  temperature: daily.temperature / hourCounter,
                  humidity: daily.humidity / hourCounter,
                  soil_moisture: daily.soil_moisture / hourCounter,
                  height: daily.height / hourCounter
                };

                await Avedays.create(averageDay);
                await Avehours.deleteMany();
                hourCounter = 0;

                // Process final data after 8 days
                const dayCount = await Avedays.countDocuments();
                if (dayCount >= 8) {
                  const days = await Avedays.find();
                  const processed = days.reduce((acc, e) => {
                    acc.temperature += e.temperature;
                    acc.humidity += e.humidity;
                    acc.soil_moisture += e.soil_moisture;
                    acc.height += e.height;
                    return acc;
                  }, { temperature: 0, humidity: 0, soil_moisture: 0, height: 0 });

                  await ProcessedData.create({
                    temperature: processed.temperature / dayCount,
                    humidity: processed.humidity / dayCount,
                    soil_moisture: processed.soil_moisture / dayCount,
                    height: processed.height / dayCount
                  });

                  await Avedays.deleteMany();
                  clearInterval(intervalId);
                  intervalId = null;
                  console.log('8 days processed. Process ended.');
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Fetch/store error:', err);
      }
    }, 1000); // Runs every second

    res.status(200).json({ message: 'Process started' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// POST /stop-process
router.post('/stop-process', async (req, res) => {
  try {
    if (!intervalId) return res.status(400).json({ message: 'No process running' });
    clearInterval(intervalId);
    intervalId = null;
    await Temperature.deleteMany();
    await Aveminuts.deleteMany();
    await Avehours.deleteMany();
    await Avedays.deleteMany();
    res.status(200).json({ message: 'Process stopped and data cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error stopping process' });
  }
});

// POST /add-test-data
router.post('/add-test-data', async (req, res) => {
  try {
    const { temperature, humidity, soil_moisture, height } = req.body;

    // Create a new document in the ProcessedData collection
    const testData = await ProcessedData.create({ temperature, humidity, soil_moisture, height });

    res.status(200).json({ message: 'Test data added successfully', data: testData });
  } catch (err) {
    console.error('Error adding test data:', err);
    res.status(500).json({ message: 'Failed to add test data', error: err.message });
  }
});
module.exports = router;