"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProjectUrlsAction,
  addDeliverableAction,
  deleteDeliverableAction,
} from "@/actions/projects";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  Globe,
  Presentation,
  Palette,
  FolderArchive,
  Copy,
  Check,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";

interface DeliverableItem {
  id: string;
  title: string;
  url: string;
  type: string;
  status: string;
  createdAt: Date;
}

interface DeliverablesHubProps {
  projectId: string;
  previewUrl: string | null;
  pitchDeckUrl: string | null;
  creativeDeckUrl: string | null;
  finalAssetsUrl: string | null;
  customDeliverables: DeliverableItem[];
}

export function ProjectDeliverablesHub({
  projectId,
  previewUrl,
  pitchDeckUrl,
  creativeDeckUrl,
  finalAssetsUrl,
  customDeliverables,
}: DeliverablesHubProps) {
  const router = useRouter();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editUrlsOpen, setEditUrlsOpen] = useState(false);
  const [addCustomOpen, setAddCustomOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpdatePrimaryUrls = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", projectId);

    await updateProjectUrlsAction(formData);
    setLoading(false);
    setEditUrlsOpen(false);
    router.refresh();
  };

  const handleAddCustomDeliverable = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", projectId);

    await addDeliverableAction(formData);
    setLoading(false);
    setAddCustomOpen(false);
    router.refresh();
  };

  const handleDeleteDeliverable = async (deliverableId: string) => {
    if (confirm("Are you sure you want to remove this deliverable URL?")) {
      await deleteDeliverableAction(deliverableId, projectId);
      router.refresh();
    }
  };

  const primaryDeliverables = [
    {
      key: "previewUrl",
      name: "Preview Links",
      subtitle: "Staging, Prototypes & Interactive Web",
      url: previewUrl,
      icon: Globe,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      buttonBg: "hover:bg-emerald-500/10 hover:text-emerald-300",
      placeholder: "e.g. https://staging.locomotion.agency/preview",
    },
    {
      key: "pitchDeckUrl",
      name: "Pitch Deck",
      subtitle: "Strategy, Keynote & Google Slides",
      url: pitchDeckUrl,
      icon: Presentation,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      buttonBg: "hover:bg-indigo-500/10 hover:text-indigo-300",
      placeholder: "e.g. https://slides.google.com/presentation/d/...",
    },
    {
      key: "creativeDeckUrl",
      name: "Creative Deck",
      subtitle: "Figma Tokens, Miro & Moodboards",
      url: creativeDeckUrl,
      icon: Palette,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      buttonBg: "hover:bg-purple-500/10 hover:text-purple-300",
      placeholder: "e.g. https://figma.com/file/...",
    },
    {
      key: "finalAssetsUrl",
      name: "Final Assets",
      subtitle: "Approved Masters, Drive & Frame.io",
      url: finalAssetsUrl,
      icon: FolderArchive,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      buttonBg: "hover:bg-amber-500/10 hover:text-amber-300",
      placeholder: "e.g. https://drive.google.com/drive/folders/...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-indigo-400" />
            <span>Centralized Deliverables & Master URLs</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Centralized hub for all client preview links, pitch decks, Figma boards, and asset drives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Primary URLs Dialog */}
          <Dialog open={editUrlsOpen} onOpenChange={setEditUrlsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Primary URLs</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <form onSubmit={handleUpdatePrimaryUrls}>
                <DialogHeader>
                  <DialogTitle>Update Centralized Deliverable URLs</DialogTitle>
                  <DialogDescription className="text-xs">
                    Input or update master links for this client project.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                  {primaryDeliverables.map((item) => (
                    <div key={item.key} className="space-y-1.5">
                      <Label htmlFor={item.key} className="flex items-center gap-1.5">
                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{item.name}</span>
                      </Label>
                      <Input
                        id={item.key}
                        name={item.key}
                        defaultValue={item.url || ""}
                        placeholder={item.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditUrlsOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Save URLs</span>
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Custom Deliverable Dialog */}
          <Dialog open={addCustomOpen} onOpenChange={setAddCustomOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Deliverable URL</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleAddCustomDeliverable}>
                <DialogHeader>
                  <DialogTitle>Add Custom Deliverable Link</DialogTitle>
                  <DialogDescription className="text-xs">
                    Link additional assets, test builds, API documentation, or media kits.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Deliverable Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. iOS TestFlight Build, Brand Guidelines PDF"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      name="url"
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="type">Deliverable Category</Label>
                    <select
                      id="type"
                      name="type"
                      defaultValue="OTHER"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    >
                      <option value="PREVIEW" className="bg-popover text-foreground">Interactive Preview</option>
                      <option value="CREATIVE_DECK" className="bg-popover text-foreground">Creative / Figma</option>
                      <option value="PITCH_DECK" className="bg-popover text-foreground">Pitch / Strategy Deck</option>
                      <option value="FINAL_ASSET" className="bg-popover text-foreground">Final Assets & Masters</option>
                      <option value="OTHER" className="bg-popover text-foreground">Other Deliverable</option>
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddCustomOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Add Deliverable</span>
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Primary Deliverables Grid (4 Core Categories) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryDeliverables.map((item) => {
          const Icon = item.icon;
          const hasUrl = Boolean(item.url);

          return (
            <Card
              key={item.key}
              className={`border transition-all flex flex-col justify-between ${
                hasUrl
                  ? "border-border/80 bg-card/70 hover:border-indigo-500/40"
                  : "border-dashed border-border/50 bg-secondary/20"
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {hasUrl ? (
                    <Badge variant="success" className="text-[9px]">Linked</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] text-muted-foreground">Not Set</Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-semibold">{item.name}</CardTitle>
                <CardDescription className="text-[11px] leading-tight">
                  {item.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                {hasUrl ? (
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono text-muted-foreground truncate bg-secondary/50 px-2 py-1 rounded border border-border/40">
                      {item.url}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        asChild
                        size="sm"
                        variant="default"
                        className="flex-1 h-7 text-xs gap-1"
                      >
                        <a href={item.url!} target="_blank" rel="noopener noreferrer">
                          <span>Open</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        onClick={() => copyToClipboard(item.url!, item.key)}
                        title="Copy Link"
                      >
                        {copiedKey === item.key ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-7 border-dashed border-border/80"
                    onClick={() => setEditUrlsOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <span>Attach Link</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Deliverables Table / List */}
      {customDeliverables.length > 0 && (
        <Card className="border-border/80 bg-card/60">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Additional Project Deliverables</CardTitle>
            <CardDescription className="text-xs">
              Supplementary assets and shared client links.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="divide-y divide-border/40">
              {customDeliverables.map((deliv) => (
                <div
                  key={deliv.id}
                  className="py-2.5 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                      {deliv.type}
                    </Badge>
                    <div className="truncate">
                      <p className="font-semibold text-foreground truncate">
                        {deliv.title}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground truncate">
                        {deliv.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                    >
                      <a href={deliv.url} target="_blank" rel="noopener noreferrer">
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      onClick={() => handleDeleteDeliverable(deliv.id)}
                      title="Remove Deliverable"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
