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
    "/customers-count",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const customerData = await User.find({role:2});

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

        const [todayCount, weekCount, monthCount] = await Promise.all([
          customerData.countDocuments({
            date: {
              $gte: todayInterval.start.toJSDate(),
              $lte: todayInterval.end.toJSDate(),
            },
          }),
          customerData.countDocuments({
            date: {
              $gte: weekInterval.start.toJSDate(),
              $lte: weekInterval.end.toJSDate(),
            },
          }),
          customerData.countDocuments({
            date: {
              $gte: monthInterval.start.toJSDate(),
              $lte: monthInterval.end.toJSDate(),
            },
          }),
        ]);

        return {
          todayCount,
          weekCount,
          monthCount,
        };
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/retailers-count",
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

        const [todayCount, weekCount, monthCount] = await Promise.all([
          User.countDocuments({
            date: {
              $gte: todayInterval.start.toJSDate(),
              $lte: todayInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            date: {
              $gte: weekInterval.start.toJSDate(),
              $lte: weekInterval.end.toJSDate(),
            },
          }),
          User.countDocuments({
            date: {
              $gte: monthInterval.start.toJSDate(),
              $lte: monthInterval.end.toJSDate(),
            },
          }),
        ]);

        return {
          todayCount,
          weekCount,
          monthCount,
        };
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}

module.exports = getDashboardData;
