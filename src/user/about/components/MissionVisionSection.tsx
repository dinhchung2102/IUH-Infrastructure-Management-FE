import { Reveal } from "@/components/motion";
import { Target, Eye } from "lucide-react";
import { motion } from "framer-motion";

export function MissionVisionSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        {/* Sứ mệnh Section */}
        <div className="mb-20">
          <Reveal delay={0}>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Nội dung Sứ mệnh */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Target className="h-6 w-6 text-blue-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Sứ mệnh
                  </h2>
                </motion.div>
                <motion.p
                  className="text-lg leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Tham mưu và giúp Hiệu trưởng trong việc quản lý, tổng hợp, đề
                  xuất ý kiến, tổ chức thực hiện việc quản lý toàn bộ hệ thống
                  của trường về công tác quản trị, quản lý toàn bộ thiết bị của
                  Trường, quản lý công tác đầu tư xây dựng.
                </motion.p>
              </motion.div>

              {/* Hình ảnh Sứ mệnh */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50 dark:border-blue-800/50 overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-center space-y-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Target className="w-10 h-10 text-blue-600" />
                      </motion.div>
                      <motion.p
                        className="text-sm text-muted-foreground font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        Quản lý toàn diện
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Tầm nhìn Section */}
        <div>
          <Reveal delay={0.2}>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Hình ảnh Tầm nhìn */}
              <motion.div
                className="relative order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/50 overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-center space-y-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center"
                        animate={{
                          rotate: [0, -5, 5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Eye className="w-10 h-10 text-emerald-600" />
                      </motion.div>
                      <motion.p
                        className="text-sm text-muted-foreground font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        Tầm nhìn tương lai
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Nội dung Tầm nhìn */}
              <motion.div
                className="space-y-6 order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Eye className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Tầm nhìn
                  </h2>
                </motion.div>
                <motion.p
                  className="text-lg leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Trở thành đơn vị quản lý cơ sở hạ tầng tiên tiến, ứng dụng
                  công nghệ thông minh trong vận hành và bảo trì. Xây dựng hệ
                  thống quản lý toàn diện, hiệu quả và thân thiện với người
                  dùng.
                </motion.p>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
