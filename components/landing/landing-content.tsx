'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/categories';
import {
  Sprout, Truck, Shield, Users, ArrowRight, Star, MapPin, Leaf
} from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1612305424474-403a79cc4383?ixlib=rb-4.0.3&q=80&w=1280';

const CATEGORY_IMAGES: Record<string, string> = {
  verduras: 'https://www.culinaryhill.com/wp-content/uploads/2023/02/11-Ways-to-Eat-More-Vegetables-Culinary-Hill.jpg',
  frutas: 'https://live.staticflickr.com/7028/6672475421_46956486c1_b.jpg',
  granos: 'https://cdn.abacus.ai/images/a49f2313-862d-468a-a1d7-774f5766c576.png',
  hierbas: 'https://assets.epicurious.com/photos/661820a17af12b050e92c390/4:3/w_7576,h_5682,c_limit/Fresh-Herbs_HERO_040424_3581.jpg',
  lacteos: 'https://images.squarespace-cdn.com/content/v1/5c8a7e339b8fe82db9a400e9/1569947302819-PRPJ75U6F1GWV1E8Q4HS/NEW+HLF+product+line+up+4.JPG',
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function LandingContent() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={HERO_IMG} alt="Mercado de frutas y verduras frescas" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight mb-4"
          >
            Del <span className="text-[#f4a261]">Campo</span> a Tu Mesa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Conectamos a agricultores y vendedores de El Salvador directamente contigo.
            Productos frescos, naturales y sin intermediarios.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/auth?tab=cliente">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                Comprar Productos <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link href="/auth?tab=vendedor">
              <Button size="lg" className="bg-[#f4a261] text-[#1a1a1a] hover:bg-[#e09050] px-8">
                Vender en Agri Market <Sprout className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-16 bg-secondary/30">
        <div className="mx-auto max-w-[1200px] px-4">
          <AnimatedSection>
            <h2 className="font-display text-3xl font-bold text-center tracking-tight mb-2">Categorías del Campo</h2>
            <p className="text-muted-foreground text-center mb-10">Explora productos frescos y naturales por categoría</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter(c => c.id !== 'general').map((cat, i) => (
              <AnimatedSection key={cat.id}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-card group cursor-pointer"
                >
                  <div className="aspect-[4/3] relative bg-muted">
                    {CATEGORY_IMAGES[cat.id] ? (
                      <Image src={CATEGORY_IMAGES[cat.id]} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">{cat.emoji}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-sm flex items-center gap-1">
                      <span>{cat.emoji}</span> {cat.name}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Agri Market */}
      <section id="por-que" className="py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <AnimatedSection>
            <h2 className="font-display text-3xl font-bold text-center tracking-tight mb-10">
              ¿Por qué <span className="text-primary">Agri Market</span>?
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sprout, title: '100% Natural', desc: 'Productos directos del campo, sin procesos industriales.' },
              { icon: Truck, title: 'Sin Intermediarios', desc: 'Del productor a tu mesa. Precios justos para todos.' },
              { icon: Shield, title: 'Confianza', desc: 'Perfiles verificados de agricultores y vendedores locales.' },
              { icon: Users, title: 'Comunidad', desc: 'Apoyamos la agricultura local en El Salvador.' },
            ].map((b, i) => (
              <AnimatedSection key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <AnimatedSection>
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-3xl font-bold tracking-tight mb-4">
              Únete a Agri Market Hoy
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Ya seas agricultor o comprador, forma parte de la comunidad que está
              transformando la forma en que El Salvador consume productos del campo.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth?tab=cliente">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Registrarme como Comprador
                </Button>
              </Link>
              <Link href="/auth?tab=vendedor">
                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-[#2d6a4f]">
                  Registrarme como Vendedor
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
