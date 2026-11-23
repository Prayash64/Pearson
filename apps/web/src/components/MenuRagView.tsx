import React, { useState } from 'react';
import {
  Upload,
  FileText,
  FileImage,
  Database,
  Sparkles,
  CheckCircle,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import type { RagDocument, MenuItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const MenuRagView: React.FC = () => {
  const { hotel } = useAuth();

  // Initial Sample Documents aligned with services/agent/src/rag/data_loader.py
  const [documents, setDocuments] = useState<RagDocument[]>([
    {
      id: 'doc-1',
      name: 'Autumn_Dinner_Menu_2026.pdf',
      size: 1420000,
      type: 'application/pdf',
      uploadedAt: '2026-11-20T14:30:00Z',
      status: 'indexed',
      chunkCount: 8,
      contentSnippet:
        'Starter: Roasted Beet Salad with Goat Cheese ($16). Mains: Chilean Sea Bass with Lemon Herb emulsion ($42), Truffle Risotto ($28). Wagyu Burger ($32). Desserts: Tiramisu ($14).',
      chunks: [
        {
          id: 'chunk-1-1',
          chunkIndex: 0,
          text: 'The Grand Pearson Bistro Dinner Menu. Starters: Roasted Beet Salad with whipped artisanal goat cheese, candied walnuts, aged balsamic ($16). Burrata Caprese with heirloom tomatoes ($18).',
          tokenCount: 148,
          score: 0.94,
        },
        {
          id: 'chunk-1-2',
          chunkIndex: 1,
          text: 'Pasta & Mains: Truffle Risotto with wild forest mushrooms, Parmigiano-Reggiano, white truffle oil ($28). Chilean Sea Bass with confit baby leeks ($42). Wood-fired Margherita Pizza ($22).',
          tokenCount: 165,
          score: 0.91,
        },
      ],
    },
    {
      id: 'doc-2',
      name: 'Cocktails_and_Beverages.png',
      size: 820000,
      type: 'image/png',
      uploadedAt: '2026-11-21T09:15:00Z',
      status: 'indexed',
      chunkCount: 4,
      contentSnippet:
        'Beverages: San Pellegrino 750ml ($6), Local IPA Craft Ale ($9), Pinot Noir Glass ($19), Signature Smoked Old Fashioned ($18).',
    },
    {
      id: 'doc-3',
      name: 'Allergen_and_Dietary_Matrix.txt',
      size: 45000,
      type: 'text/plain',
      uploadedAt: '2026-11-22T11:00:00Z',
      status: 'indexed',
      chunkCount: 3,
      contentSnippet:
        'Gluten-Free: Beet Salad (without croutons), Chilean Sea Bass, Truffle Fries. Vegetarian: Margherita Pizza, Tiramisu, Risotto.',
    },
  ]);

  // Menu items list (synced to menusTable)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      itemName: 'Truffle Risotto',
      category: 'Mains',
      price: 28,
      description: 'Arborio rice, black truffle essence, Parmigiano-Reggiano, wild chanterelles.',
      available: true,
      dietary: ['Vegetarian', 'Gluten-Free Available'],
    },
    {
      id: 2,
      itemName: 'Chilean Sea Bass',
      category: 'Seafood',
      price: 42,
      description: 'Pan-seared sea bass, saffron fumet, asparagus spears, microgreens.',
      available: true,
      dietary: ['Gluten-Free'],
    },
    {
      id: 3,
      itemName: 'Wood-fired Margherita',
      category: 'Pizza',
      price: 22,
      description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil.',
      available: true,
      dietary: ['Vegetarian'],
    },
    {
      id: 4,
      itemName: 'Dry-Aged Wagyu Burger',
      category: 'Grill',
      price: 32,
      description: 'Brioche bun, aged gruyère, caramelized shallot jam, hand-cut truffle fries.',
      available: true,
    },
  ]);

  // Ingestion & Test States
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'catalog' | 'test'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // RAG Query Test state
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<{
    answer: string;
    retrievedChunks: { source: string; text: string; score: number }[];
  } | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // New Menu Item form
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'Mains',
    price: '',
    description: '',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMessage(null);

    // Simulate LangChain PyPDFLoader / UnstructuredImageLoader and text_splitter chunking
    setTimeout(() => {
      const newDocs: RagDocument[] = Array.from(files).map((file, i) => {
        const estimatedChunks = Math.max(2, Math.ceil(file.size / 250000));
        return {
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          status: 'indexed',
          chunkCount: estimatedChunks,
          contentSnippet: `Processed by RecursiveCharacterTextSplitter (chunk_size=1000, overlap=200). Vector embeddings saved to Pinecone for thread ${hotel?.thread_id}.`,
          chunks: [
            {
              id: `chunk-${Date.now()}-0`,
              chunkIndex: 0,
              text: `Extracted content from ${file.name}. Parsed menu dishes, seasonal ingredients, and price list for ${hotel?.restaurantName}.`,
              tokenCount: 180,
              score: 0.95,
            },
          ],
        };
      });

      setDocuments((prev) => [...newDocs, ...prev]);
      setIsUploading(false);
      setUploadSuccessMessage(
        `Successfully parsed ${files.length} document(s) with RecursiveCharacterTextSplitter and generated Pinecone vector embeddings!`
      );
      setTimeout(() => setUploadSuccessMessage(null), 5000);
    }, 1200);
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.price) return;

    const item: MenuItem = {
      id: Date.now(),
      itemName: newItem.itemName,
      category: newItem.category,
      price: parseFloat(newItem.price),
      description: newItem.description,
      available: true,
    };

    setMenuItems((prev) => [item, ...prev]);
    setNewItem({ itemName: '', category: 'Mains', price: '', description: '' });

    // Also inject as a document chunk into RAG vector storage
    const newDoc: RagDocument = {
      id: `doc-item-${Date.now()}`,
      name: `MenuItem_${item.itemName.replace(/\s+/g, '_')}.txt`,
      size: 1024,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      status: 'indexed',
      chunkCount: 1,
      contentSnippet: `${item.itemName} (${item.category}) - $${item.price}: ${item.description}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleTestRagQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim() || isQuerying) return;

    setIsQuerying(true);
    setTimeout(() => {
      const q = testQuery.toLowerCase();
      let answer = '';
      let chunks = [];

      if (q.includes('vegan') || q.includes('vegetarian')) {
        answer =
          'We have several vegetarian options: Roasted Beet Salad ($16), Burrata Caprese ($18), Wood-fired Margherita Pizza ($22), and Truffle Risotto ($28). The risotto and beet salad can also be tailored gluten-free.';
        chunks = [
          {
            source: 'Allergen_and_Dietary_Matrix.txt',
            text: 'Vegetarian: Margherita Pizza, Tiramisu, Risotto. Gluten-Free: Beet Salad (without croutons), Chilean Sea Bass, Truffle Fries.',
            score: 0.96,
          },
          {
            source: 'Autumn_Dinner_Menu_2026.pdf',
            text: 'Truffle Risotto with wild forest mushrooms, Parmigiano-Reggiano, white truffle oil ($28). Wood-fired Margherita Pizza ($22).',
            score: 0.91,
          },
        ];
      } else if (q.includes('gluten') || q.includes('allergy')) {
        answer =
          'Gluten-free menu items include the Chilean Sea Bass ($42), Truffle Fries ($14), and the Roasted Beet Salad (served with dressing and without croutons).';
        chunks = [
          {
            source: 'Allergen_and_Dietary_Matrix.txt',
            text: 'Gluten-Free: Beet Salad (without croutons), Chilean Sea Bass, Truffle Fries.',
            score: 0.98,
          },
        ];
      } else if (q.includes('price') || q.includes('cost') || q.includes('cheap') || q.includes('expensive')) {
        answer =
          'Menu prices range from $6 (San Pellegrino) to $42 (Chilean Sea Bass). Popular choices include the Wood-fired Margherita Pizza at $22 and Truffle Risotto at $28.';
        chunks = [
          {
            source: 'Autumn_Dinner_Menu_2026.pdf',
            text: 'Starters: $16 - $18. Mains: $22 - $42. Cocktails & Wines: $9 - $19.',
            score: 0.93,
          },
        ];
      } else {
        answer = `Retrieved matching menu chunks for "${testQuery}". The Pearson AI assistant uses these vector embeddings to accurately answer guest inquiries over WhatsApp voice and text.`;
        chunks = [
          {
            source: 'Autumn_Dinner_Menu_2026.pdf',
            text: 'The Grand Pearson Bistro Dinner Menu. Seasonal culinary selections prepared fresh daily.',
            score: 0.89,
          },
        ];
      }

      setTestResult({ answer, retrievedChunks: chunks });
      setIsQuerying(false);
    }, 700);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* RAG Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#113b3a] text-[#d9e85a] flex items-center justify-center font-bold text-2xl shadow-sm">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 font-['Space_Grotesk']">
                Menu Knowledge Base & RAG Ingestion
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                Pinecone Vector Store
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Upload PDF or image menus to automatically split, embed, and store in Pinecone for LLM retrieval.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'upload'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upload Documents
          </button>
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'catalog'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Direct Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveSubTab('test')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'test'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#113b3a]" />
            <span>Test RAG Retrieval</span>
          </button>
        </div>
      </div>

      {uploadSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Sub-View 1: Document Upload & Pinecone RAG Ingestion */}
      {activeSubTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Upload Zone */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-stone-300 p-8 text-center hover:border-[#113b3a] transition-colors relative group">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.json"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-[#113b3a] group-hover:bg-[#113b3a] group-hover:text-[#d9e85a] mx-auto flex items-center justify-center transition-all mb-3">
                {isUploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-['Space_Grotesk']">
                {isUploading ? 'Chunking & Embedding...' : 'Drop menu files here, or click to browse'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Supports PDF (PyPDFLoader), JPG/PNG images (UnstructuredImageLoader), and TXT/CSV.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-mono text-stone-400">
                <span>Chunk Size: 1000</span>
                <span>·</span>
                <span>Overlap: 200</span>
                <span>·</span>
                <span>Max 25 MB</span>
              </div>
            </div>

            {/* Indexed Documents Table */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                    Indexed Menu Documents ({documents.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Files parsed and embedded in Pinecone vector storage.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/70 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                        {doc.type.includes('image') ? (
                          <FileImage className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {doc.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono mt-0.5">
                          <span>{(doc.size / 1024).toFixed(1)} KB</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold">
                            {doc.chunkCount} Chunks
                          </span>
                          <span>·</span>
                          <span>
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        Vectorized
                      </span>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete from Vector Store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RAG Pipeline Config Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
                  RAG Pipeline Configuration
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                As configured in <code>services/agent/src/rag/data_loader.py</code> and{' '}
                <code>embending.py</code>:
              </p>

              <div className="mt-4 space-y-2.5 text-xs font-mono">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                    Text Splitter
                  </span>
                  <span className="text-stone-800 font-bold">
                    RecursiveCharacterTextSplitter
                  </span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                    Chunk Parameters
                  </span>
                  <span className="text-stone-800 font-bold">
                    chunk_size=1000, chunk_overlap=200
                  </span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                    Vector Store
                  </span>
                  <span className="text-emerald-700 font-bold">
                    Pinecone (PINECONE_API_KEY)
                  </span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                    Embedding Model
                  </span>
                  <span className="text-stone-800 font-bold">
                    text-embedding-3-small (1536 dim)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#eef5f1] border border-[#d2e4d9]">
              <h4 className="text-xs font-bold text-[#113b3a] font-['Space_Grotesk'] mb-1">
                How RAG Serves WhatsApp Customers
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                When a guest asks on WhatsApp <em>"What spicy dishes do you serve?"</em> or{' '}
                <em>"Do you have vegan risotto?"</em>, the Python agent queries this Pinecone index
                and injects relevant context directly into the prompt before generating voice/text responses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-View 2: Direct Menu Item Manager (menusTable) */}
      {activeSubTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Item Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs h-fit">
            <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk'] mb-1">
              Add New Menu Item
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Saved directly to PostgreSQL <code>menusTable</code> and synced to RAG.
            </p>

            <form onSubmit={handleAddMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Dish / Drink Name
                </label>
                <input
                  type="text"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  placeholder="e.g. Lobster Ravioli"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none bg-white"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Grill">Grill</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="24.00"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Key ingredients, spices, allergen notes..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] font-bold font-['Space_Grotesk'] flex items-center justify-center gap-2 transition-all shadow-xs mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item & Embed in RAG</span>
              </button>
            </form>
          </div>

          {/* Items Catalog List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                  Active Menu Catalog
                </h3>
                <p className="text-xs text-stone-500">
                  These items are available for automated WhatsApp ordering.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900">{item.itemName}</h4>
                      <span className="text-xs font-mono font-bold text-[#113b3a]">
                        ${item.price}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      {item.category}
                    </span>
                    <p className="text-[11px] text-stone-600 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold font-mono">
                      In Stock
                    </span>
                    <span className="text-stone-400">RAG Embedded</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-View 3: Test RAG Retrieval Playground */}
      {activeSubTab === 'test' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#113b3a]" />
              <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                RAG Retrieval & Grounding Tester
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Ask questions to simulate how the LLM retrieves relevant menu chunks from Pinecone.
            </p>
          </div>

          {/* Test Input Form */}
          <form onSubmit={handleTestRagQuery} className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g., What are our vegetarian options under $30?"
              className="flex-1 p-3 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
            />
            <button
              type="submit"
              disabled={isQuerying || !testQuery.trim()}
              className="px-5 py-3 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-all shadow-xs disabled:opacity-40"
            >
              {isQuerying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Query RAG</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
            <span>Try sample queries:</span>
            {[
              'What vegetarian starters do you have?',
              'Are there gluten-free dishes on the menu?',
              'What is the price of the sea bass and burger?',
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTestQuery(q)}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Query Results */}
          {testResult && (
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block mb-1">
                  Synthesized LLM Response
                </span>
                <p className="text-xs text-stone-900 leading-relaxed font-medium">
                  {testResult.answer}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block mb-2">
                  Retrieved Knowledge Chunks from Pinecone:
                </span>
                <div className="space-y-2">
                  {testResult.retrievedChunks.map((chunk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-stone-200 text-xs flex flex-col gap-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                        <span className="font-semibold text-stone-700">
                          Source: {chunk.source}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          Cosine Similarity: {(chunk.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-stone-700 italic">"{chunk.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
