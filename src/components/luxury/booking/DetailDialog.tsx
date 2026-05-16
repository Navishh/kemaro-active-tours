import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Hotel, Place } from "@/lib/sriLanka/data";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: (Place | Hotel) & { kind: "place" | "hotel" };
};

const DetailDialog = ({ open, onOpenChange, item }: Props) => {
  const isHotel = item.kind === "hotel";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/60 bg-card p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative h-56 md:h-full bg-secondary">
            <img
              src={item.images[0]}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => ((e.currentTarget.style.opacity = "0.2"))}
            />
            <div className="absolute inset-0 overlay-cinematic opacity-40" />
          </div>
          <div className="p-6 md:p-8">
            <DialogHeader className="space-y-2 text-left">
              <span className="eyebrow">{isHotel ? `${"★".repeat((item as Hotel).stars)}` : (item as Place).type}</span>
              <DialogTitle className="font-display text-2xl md:text-3xl text-foreground leading-tight">
                {item.name}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </DialogDescription>
            </DialogHeader>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-primary/80">Hours</dt>
                <dd className="mt-1 text-foreground/90">{item.hours}</dd>
              </div>
              {isHotel && (
                <>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-primary/80">Dining</dt>
                    <dd className="mt-1 text-foreground/90">{(item as Hotel).dining}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-primary/80">Amenities</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {(item as Hotel).amenities.map((a) => (
                        <span key={a} className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-foreground/80">
                          {a}
                        </span>
                      ))}
                    </dd>
                  </div>
                </>
              )}
            </dl>

            {item.images.length > 1 && (
              <div className="mt-6 grid grid-cols-3 gap-2">
                {item.images.slice(1, 4).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded bg-secondary">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;
