import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="container py-16 md:py-24">
      <Reveal>
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-2xl transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <FileText className="mb-4 h-12 w-12 text-primary" />
            </motion.div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Gặp vấn đề về cơ sở vật chất?
            </h2>
            <p className="mb-6 max-w-xl text-muted-foreground">
              Hãy để chúng tôi biết! Báo cáo ngay để được hỗ trợ nhanh chóng.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl">
                <Link to="/report">
                  Báo cáo ngay
                  <ArrowRight className=" h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
