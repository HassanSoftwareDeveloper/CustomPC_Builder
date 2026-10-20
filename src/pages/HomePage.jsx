import { Link } from "react-router-dom";
import Icon from "../Components/Ui/Icon";
import ProductImage from "../Components/Ui/ProductImage";
import StepCard from "../Components/Ui/StepCard";
import ProductCard from "../Features/catalog/ProductCard";
import { BUILDER_SLOTS } from "../data/builderSlots";
import { PRODUCTS } from "../data/products";
import { getProductImage } from "../utils/productImage";

function HomePage() {
  return (
    <div className="pb-8">
      <section className="content-width pt-8 sm:pt-12">
        <div className="glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="py-2 lg:py-8">
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl">Build a PC that fits your needs.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted">Choose your components, check compatibility, and keep an eye on the total as you go.</p>
              <div className="mt-7 flex flex-wrap gap-3"><Link to="/builder" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-strong">Build your PC <Icon name="arrow" className="h-4 w-4" /></Link><Link to="/parts" className="inline-flex min-h-11 items-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary">Explore parts</Link></div>
            </div>
            <ProductImage src="/images/hero.jpg" alt="A desktop PC photographed for Apna PC" loading="eager" className="h-72 w-full rounded-xl border border-border object-cover sm:h-[26rem] lg:h-[30rem]" />
          </div>
        </div>
      </section>

      <section className="content-width mt-14 sm:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Shop by component</h2></div><Link to="/parts" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">All parts <Icon name="arrow" className="h-4 w-4" /></Link></div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BUILDER_SLOTS.map((category) => {
            const product = PRODUCTS.find((item) => item.category === category);
            return <Link key={category} to={`/parts?category=${encodeURIComponent(category)}`} className="group glass-panel overflow-hidden rounded-xl transition-colors hover:border-primary/40"><div className="h-28 overflow-hidden bg-bg sm:h-32"><ProductImage src={product ? getProductImage(product) : null} alt="" className="h-full w-full transition duration-300 group-hover:scale-[1.02]" /></div><div className="px-3 py-3 text-sm font-semibold text-ink">{category}</div></Link>;
          })}
        </div>
      </section>

      <section className="content-width mt-14 sm:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Popular parts</h2></div><Link to="/parts" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Browse the catalog <Icon name="arrow" className="h-4 w-4" /></Link></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{PRODUCTS.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="content-width mt-14 sm:mt-20">
        <div><h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">How it works</h2><p className="mt-2 max-w-2xl text-muted">Choose your parts, check the list, then add the finished build to your cart.</p></div>
        <div className="mt-6 grid gap-4 md:grid-cols-3"><StepCard number="01" title="Choose your parts" text="Browse processors, graphics cards, memory, storage, and other components." /><StepCard number="02" title="Check compatibility" text="Review your selections and see any compatibility issues in the builder." /><StepCard number="03" title="Review your build" text="Check the parts and total, then add everything to your cart." /></div>
      </section>
    </div>
  );
}

export default HomePage;
