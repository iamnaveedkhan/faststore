const { Model2, User } = require("../../models/allModels");
const { DateTime, Interval } = require("luxon");

async function getDashboardData(fastify, options) {
  fastify.get(
    "/models-count",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const totalModelCount = await Model2.countDocuments();
        const activeModelCount = await Model2.countDocuments({
          isActive: true,
        });
        return { totalModelCount, activeModelCount };
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/users-count",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const now = DateTime.local();
        const timeZone = "Asia/Kolkata";
        const nowIST = now.setZone(timeZone);
  
        const todayInterval = Interval.fromDateTimes(
          nowIST.startOf("day"),
          nowIST.endOf("day")
        );
        const weekInterval = Interval.fromDateTimes(
          nowIST.startOf("week").set({ weekday: 1 }),
          nowIST.endOf("week")
        );
        const monthInterval = Interval.fromDateTimes(
          nowIST.startOf("month"),
          nowIST.endOf("month")
        );

        console.log(nowIST.startOf("month"));
        console.log(nowIST.endOf("month"));
  
        const [todayCustomerCount, weekCustomerCount, monthCustomerCount, todayRetailerCount, weekRetailerCount, monthRetailerCount] = await Promise.all([
          User.countDocuments({
            role: 1,
            date: {
              $gte: todayInterval.start.toJSDate(),
              $lte: todayInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            role: 1,
            date: {
              $gte: weekInterval.start.toJSDate(),
              $lte: weekInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            role: 1,
            date: {
              $gte: monthInterval.start.toJSDate(),
              $lte: monthInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            role: 2,
            date: {
              $gte: todayInterval.start.toJSDate(),
              $lte: todayInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            role: 2,
            date: {
              $gte: weekInterval.start.toJSDate(),
              $lte: weekInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            role: 2,
            date: {
              $gte: monthInterval.start.toJSDate(),
              $lte: monthInterval.end.toJSDate(),
            },
          }),
        ]);
  
        return {
          customer: {
            todayAddedCustomerCount: todayCustomerCount,
            weekAddedCustomerCount: weekCustomerCount,
            monthAddedCustomerCount: monthCustomerCount,
          },
          retailer: {
            todayAddedRetailerCount: todayRetailerCount,
            weekAddedRetailerCount: weekRetailerCount,
            monthAddedRetailerCount: monthRetailerCount,
          },
        };
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
  
}

module.exports = getDashboardData;
