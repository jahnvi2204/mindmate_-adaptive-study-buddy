import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Plus,
  X,
  Save,
  Book,
  File,
  Loader2,
} from 'lucide-react';
import { StudyMaterial } from '../types';

interface MaterialsViewProps {
  materials: StudyMaterial[];
  onAddMaterial: (material: StudyMaterial) => void;
  onRemoveMaterial: (id: string) => void;
}

const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onAddMaterial,
  onRemoveMaterial,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isPdfSource, setIsPdfSource] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newMaterial: StudyMaterial = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      dateAdded: Date.now(),
      type: isPdfSource ? 'file' : 'text',
    };

    onAddMaterial(newMaterial);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
    setIsParsing(false);
    setIsPdfSource(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    setIsParsing(true);
    setIsPdfSource(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      // @ts-expect-error pdfjs worker config typing
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Allow larger PDFs but cap pages to avoid UI freeze; chunk processing for large files.
      const maxPages = Math.min(pdf.numPages, 150); // up to 150 pages
      let fullText = '';

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;

        // Yield control periodically for very large files
        if (i % 10 === 0) {
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      if (pdf.numPages > maxPages) {
        fullText += `\n... (Content truncated at ${maxPages} pages for performance) ...`;
      }

      setNewContent(fullText);
      if (!newTitle) {
        setNewTitle(file.name.replace('.pdf', ''));
      }
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Failed to extract text from the PDF. Please try another file or reduce size.');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative space-y-10 animate-fadeIn">
      {/* Soft background glows specific to Library section */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[15%] h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[10%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/5 pb-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
            Knowledge Base
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Library
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            Upload notes, PDFs, and concepts to train your AI study companion.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(79,70,229,0.65)] transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_65px_rgba(56,189,248,0.7)] active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>Add Material</span>
        </button>
      </div>

      {/* Modal Overlay for Adding */}
      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity"
            onClick={resetForm}
          />

          {/* Neon blobs inside modal space */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="absolute bottom-[-15%] right-[-5%] h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
          </div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/90 shadow-[0_24px_80px_rgba(15,23,42,0.98)] backdrop-blur-2xl animate-fadeIn">
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

            <div className="relative p-7 md:p-9">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-2.5 shadow-[0_12px_35px_rgba(129,140,248,0.4)]">
                    <Upload className="h-5 w-5 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      Upload Material
                    </h3>
                    <p className="text-xs text-slate-400">
                      Import a PDF or paste your notes to enrich your study space.
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="rounded-full bg-slate-900/70 p-2 text-slate-500 transition-all hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title + PDF Import */}
                <div>
                  <div className="mb-2 ml-1 flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Document Title
                    </label>

                    {/* PDF Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="application/pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleFileClick}
                      disabled={isParsing}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300 transition-colors hover:text-violet-100 disabled:opacity-60"
                    >
                      {isParsing ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Parsing PDF...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3" />
                          Import PDF
                        </>
                      )}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Physics Chapter 3: Thermodynamics"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:bg-black/70 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    autoFocus
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Content / Notes
                  </label>
                  <div className="relative">
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={10}
                      disabled={isParsing}
                      placeholder={
                        isParsing
                          ? 'Extracting text from PDF, please wait...'
                          : 'Paste your text content, syllabus, or notes here...'
                      }
                      className={`custom-scrollbar w-full resize-none rounded-xl border border-white/10 bg-black/40 px-5 py-3.5 text-sm font-mono leading-relaxed text-slate-300 outline-none transition-all placeholder:text-slate-600 focus:bg-black/70 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 ${
                        isParsing ? 'opacity-60 animate-pulse' : ''
                      }`}
                    />
                    {isParsing && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newContent.trim() || isParsing}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-2.5 text-sm font-bold text-slate-950 shadow-[0_16px_45px_rgba(148,163,184,0.7)] transition-all hover:bg-violet-50 hover:shadow-[0_20px_55px_rgba(129,140,248,0.8)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save to Library</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grid / Empty State */}
      {materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/8 bg-slate-950/60 py-20 text-center shadow-[0_22px_70px_rgba(15,23,42,0.95)]">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900">
              <Book className="h-9 w-9 text-slate-500" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Library Empty</h3>
          <p className="mb-7 max-w-sm text-sm leading-relaxed text-slate-400">
            Upload course notes, syllabi, or articles to power the AI Tutor&apos;s personalization
            engine and build your knowledge base.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-full border border-violet-400/40 bg-violet-500/10 px-6 py-2.5 text-sm font-medium text-violet-100 transition-all hover:bg-violet-500/20 hover:text-white hover:shadow-[0_16px_40px_rgba(129,140,248,0.8)]"
          >
            Add First Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {materials.map((item, idx) => (
            <div
              key={item.id}
              className="group relative flex h-72 flex-col rounded-[2rem] border border-white/8 bg-slate-950/70 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_24px_70px_rgba(79,70,229,0.8)]"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Card subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 via-transparent to-transparent" />

              <div className="relative z-10 mb-5 flex items-start justify-between">
                <div
                  className={`rounded-2xl border p-3.5 transition-all duration-300 ${
                    item.type === 'file'
                      ? 'border-orange-500/30 bg-orange-500/10 text-orange-300 group-hover:border-orange-400/60 group-hover:bg-orange-500/20'
                      : 'border-slate-600/50 bg-slate-900 text-slate-300 group-hover:border-violet-500/50 group-hover:bg-violet-900/20 group-hover:text-violet-200'
                  }`}
                >
                  {item.type === 'file' ? (
                    <File className="h-6 w-6" />
                  ) : (
                    <FileText className="h-6 w-6" />
                  )}
                </div>
                <button
                  onClick={() => onRemoveMaterial(item.id)}
                  className="rounded-xl p-2.5 text-slate-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="relative z-10 mb-3 line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-violet-100">
                {item.title}
              </h3>

              <div className="relative z-10 flex-1 overflow-hidden">
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-500 transition-colors group-hover:text-slate-300">
                  {item.content}
                </p>
              </div>

              <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                <span>{item.type === 'file' ? 'PDF Import' : 'Text Note'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsView;
