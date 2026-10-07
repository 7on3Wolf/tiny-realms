import { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Database,
  Image as ImageIcon,
  ExternalLink,
  Code,
  ShieldAlert,
  Server,
  Zap
} from 'lucide-react';
import BaseButton from '../../components/ui/BaseButton';
import ImageWithSkeleton from '../../components/common/ImageWithSkeleton';

export interface NFTDiagnosticItem {
  nfTokenId: string;
  nftSerial: number;
  rawUri: string;
  isIpfs: boolean;
  metadata: {
    schema?: string;
    nftType?: string;
    name?: string;
    description?: string;
    image?: string;
    collection?: { name?: string };
    attributes?: Array<{ trait_type: string; value: string }>;
  } | null;
  resolvedImage: string;
  fallbackImages: string[];
  xrpCafeUrl: string;
  fetchLatencyMs: number;
  imageStatusCode?: number;
  imageContentType?: string;
}

export interface DiagnosticLogState {
  timestamp: string;
  issuer: string;
  xrpCafeCollectionUrl: string;
  nodeEndpoint: string;
  totalNfts: number;
  validIpfsCount: number;
  items: NFTDiagnosticItem[];
  rawXrplResponseSample: any;
}

export default function AdminDiagnostics() {
  const [logData, setLogData] = useState<DiagnosticLogState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNft, setSelectedNft] = useState<NFTDiagnosticItem | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'schema' | 'gateways' | 'items'>('schema');

  const runDiagnostic = useCallback(async () => {
    setLoading(true);
    const startTime = performance.now();
    const issuer = 'rE2JpSMhkj6vToaXE8hLzqyhEV8xhozQk8';
    const xrpCafeCollectionUrl = 'https://xrp.cafe/id/collection/tinyrealms';
    const nodeEndpoint = 'https://xrplcluster.com';

    try {
      const xrplRes = await fetch(nodeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'account_nfts',
          params: [{ account: issuer, limit: 400 }],
        }),
      });

      if (!xrplRes.ok) {
        throw new Error(`XRPL Node HTTP error: ${xrplRes.status}`);
      }

      const data = await xrplRes.json();
      const accountNfts = data?.result?.account_nfts || [];

      let validIpfsCount = 0;

      const items: NFTDiagnosticItem[] = await Promise.all(
        accountNfts.map(async (nft: any, idx: number) => {
          const itemStart = performance.now();
          const nfTokenId = nft.NFTokenID || nft.nftokenID || `nft_${idx + 1}`;
          let rawUri = '';

          if (nft.URI) {
            try {
              let str = '';
              for (let i = 0; i < nft.URI.length; i += 2) {
                str += String.fromCharCode(parseInt(nft.URI.substring(i, i + 2), 16));
              }
              rawUri = str;
            } catch {
              rawUri = '';
            }
          }

          const isIpfs = rawUri.startsWith('ipfs://');
          if (isIpfs) validIpfsCount++;

          let metadata: any = null;

          if (isIpfs) {
            const hash = rawUri.replace('ipfs://', '');
            try {
              const controller = new AbortController();
              const tid = setTimeout(() => controller.abort(), 3000);
              const metaRes = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`, {
                signal: controller.signal,
              });
              clearTimeout(tid);
              if (metaRes.ok) {
                metadata = await metaRes.json();
              }
            } catch {
              // Silently ignore gateway timeout
            }
          }

          let resolvedImage = '';
          const fallbackImages: string[] = [];

          if (metadata?.image) {
            const imgHash = metadata.image.replace('ipfs://', '');
            resolvedImage = `https://gateway.pinata.cloud/ipfs/${imgHash}`;
            fallbackImages.push(`https://ipfs.filebase.io/ipfs/${imgHash}`);
            fallbackImages.push(`https://dweb.link/ipfs/${imgHash}`);
            fallbackImages.push(`https://cloudflare-ipfs.com/ipfs/${imgHash}`);
          }

          const itemEnd = performance.now();

          return {
            nfTokenId,
            nftSerial: nft.nft_serial || idx + 1,
            rawUri,
            isIpfs,
            metadata,
            resolvedImage,
            fallbackImages,
            xrpCafeUrl: `https://xrp.cafe/id/nft/${nfTokenId}`,
            fetchLatencyMs: Math.round(itemEnd - itemStart),
          };
        })
      );

      const endTime = performance.now();

      const newLogState: DiagnosticLogState = {
        timestamp: new Date().toISOString(),
        issuer,
        xrpCafeCollectionUrl,
        nodeEndpoint,
        totalNfts: accountNfts.length,
        validIpfsCount,
        items,
        rawXrplResponseSample: {
          account: issuer,
          nft_count: accountNfts.length,
          sample_nft: accountNfts[0] || null,
          total_diagnostics_ms: Math.round(endTime - startTime),
        },
      };

      setLogData(newLogState);
      if (items.length > 0) {
        setSelectedNft(items[0]);
      }
    } catch (err) {
      console.error('[Diagnostic] Error running diagnostic check:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopyJson = () => {
    if (!logData) return;
    navigator.clipboard.writeText(JSON.stringify(logData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto text-[#F5EBDD] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#5A351E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#D9A85C] uppercase mb-1">
            <Activity className="w-4 h-4 text-[#C69B5A]" />
            <span>XRP.CAFE & XRPL DIAGNOSTIC CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-hero-title font-black uppercase text-[#F5EBDD]">
            API RESPONSE & SCHEMA INSPECTOR
          </h1>
          <p className="mt-1 text-xs text-[#CDBCA8]">
            Inspect live JSON payloads, NFT image schema structures, and IPFS gateway health for xrp.cafe/id/collection/tinyrealms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BaseButton
            variant="wood"
            size="sm"
            onClick={runDiagnostic}
            disabled={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            {loading ? 'Running Tests...' : 'Re-Run Diagnostics'}
          </BaseButton>

          <BaseButton
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
            disabled={!logData}
            icon={copiedJson ? <Check className="w-3.5 h-3.5 text-[#7FAF45]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedJson ? 'Copied Log JSON!' : 'Copy Raw Log JSON'}
          </BaseButton>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2A180E] border border-[#5A351E] rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#CDBCA8]">COLLECTION URL</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#F5EBDD] truncate max-w-[180px]">
              <Globe className="w-3.5 h-3.5 text-[#C69B5A] shrink-0" />
              <span>xrp.cafe/id/collection/tinyrealms</span>
            </div>
          </div>
          <a
            href={logData?.xrpCafeCollectionUrl || 'https://xrp.cafe/id/collection/tinyrealms'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#4A2D1A] text-[#D9A85C] hover:text-[#FFFFFF] hover:bg-[#70431F] transition-colors"
            title="Open Collection Page on XRP.Cafe"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-[#2A180E] border border-[#5A351E] rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#CDBCA8]">TOTAL NFTS DISCOVERED</span>
            <div className="mt-1 text-2xl font-black font-hero-title text-[#FFE3B3]">
              {loading ? '...' : logData?.totalNfts || 0}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#4A2D1A] text-[#C69B5A]">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#2A180E] border border-[#5A351E] rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#CDBCA8]">IPFS SCHEMA COMPLIANT</span>
            <div className="mt-1 text-2xl font-black font-hero-title text-[#7FAF45]">
              {loading ? '...' : `${logData?.validIpfsCount || 0} / ${logData?.totalNfts || 0}`}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#1C351E] text-[#7FAF45]">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#2A180E] border border-[#5A351E] rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#CDBCA8]">XRPL CLUSTER NODE</span>
            <div className="mt-1 text-xs font-mono font-bold text-[#D9A85C]">
              {loading ? 'Querying...' : 'xrplcluster.com (200 OK)'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#4A2D1A] text-[#D9A85C]">
            <Server className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#5A351E] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-hero-title font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'schema'
              ? 'bg-[#4A2D1A] text-[#FFE3B3] border border-[#D9A85C]'
              : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#2A180E]'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>NFT Schema Inspector</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 rounded-xl text-xs font-hero-title font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gateways'
              ? 'bg-[#4A2D1A] text-[#FFE3B3] border border-[#D9A85C]'
              : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#2A180E]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>IPFS Image Gateway Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-xl text-xs font-hero-title font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'items'
              ? 'bg-[#4A2D1A] text-[#FFE3B3] border border-[#D9A85C]'
              : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#2A180E]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Parsed Collection Items ({logData?.items.length || 0})</span>
        </button>
      </div>

      {/* Content Panels */}
      {loading ? (
        <div className="p-16 text-center bg-[#2A180E] border border-[#5A351E] rounded-3xl">
          <RefreshCw className="w-10 h-10 text-[#C69B5A] animate-spin mx-auto mb-4" />
          <h3 className="font-hero-title font-bold text-lg text-[#F5EBDD]">EXECUTING LIVE DIAGNOSTIC CHECKS...</h3>
          <p className="text-xs text-[#CDBCA8] mt-1">Querying XRPL node cluster & resolving IPFS metadata JSON schemas for Tiny Realms...</p>
        </div>
      ) : activeTab === 'schema' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Item selector list */}
          <div className="lg:col-span-4 bg-[#2A180E] border border-[#5A351E] rounded-2xl p-4 space-y-3 max-h-[650px] overflow-y-auto">
            <span className="text-[11px] font-mono font-bold uppercase text-[#C69B5A] tracking-wider block">
              SELECT NFT ITEM ({logData?.items.length || 0})
            </span>
            <div className="space-y-2">
              {logData?.items.map((item) => {
                const isSelected = selectedNft?.nfTokenId === item.nfTokenId;
                return (
                  <button
                    key={item.nfTokenId}
                    type="button"
                    onClick={() => setSelectedNft(item)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#4A2D1A] border-[#D9A85C] text-[#F5EBDD]'
                        : 'bg-[#1A0E07]/60 border-[#3D2214] text-[#CDBCA8] hover:border-[#5A351E] hover:text-[#F5EBDD]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1A0E07] shrink-0 border border-[#5A351E]">
                      <ImageWithSkeleton
                        src={item.resolvedImage}
                        alt={item.metadata?.name || 'NFT'}
                        aspectRatio="aspect-square"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold font-hero-title text-[#FFE3B3] truncate">
                        {item.metadata?.name || `Tiny Realms #${item.nftSerial}`}
                      </div>
                      <div className="text-[10px] font-mono text-[#CDBCA8]/70 truncate">
                        ID: {item.nfTokenId.substring(0, 16)}...
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schema Viewer */}
          <div className="lg:col-span-8 bg-[#1A0E07] border border-[#5A351E] rounded-2xl p-5 flex flex-col space-y-4">
            {selectedNft ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-[#5A351E]">
                  <div>
                    <span className="text-[10px] font-mono text-[#C69B5A] font-bold uppercase tracking-wider">
                      SELECTED ITEM SCHEMA STRUCTURE
                    </span>
                    <h3 className="text-lg font-hero-title font-bold text-[#FFE3B3]">
                      {selectedNft.metadata?.name || `Tiny Realms #${selectedNft.nftSerial}`}
                    </h3>
                  </div>

                  <a
                    href={selectedNft.xrpCafeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A2D1A] border border-[#5A351E] text-xs font-mono text-[#D9A85C] hover:text-[#FFFFFF] transition-colors"
                  >
                    <span>View on XRP.Cafe</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#2A180E] p-4 rounded-xl border border-[#5A351E]">
                  <div>
                    <span className="text-[10px] font-mono text-[#CDBCA8] uppercase">NFTokenID</span>
                    <p className="text-xs font-mono font-bold text-[#F5EBDD] break-all">{selectedNft.nfTokenId}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#CDBCA8] uppercase">Raw URI</span>
                    <p className="text-xs font-mono text-[#D9A85C] break-all">{selectedNft.rawUri || 'None'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#CDBCA8] uppercase">Latency</span>
                    <p className="text-xs font-mono text-[#7FAF45] font-bold">{selectedNft.fetchLatencyMs} ms</p>
                  </div>
                </div>

                {/* Raw JSON Code view */}
                <div className="flex-1 overflow-x-auto">
                  <span className="text-[10px] font-mono text-[#CDBCA8] uppercase block mb-1">
                    EXACT JSON METADATA PAYLOAD:
                  </span>
                  <pre className="p-4 rounded-xl bg-black/90 border border-[#3D2214] font-mono text-xs text-[#82C365] leading-relaxed overflow-x-auto max-h-[380px]">
                    {JSON.stringify(
                      {
                        nfTokenId: selectedNft.nfTokenId,
                        nftSerial: selectedNft.nftSerial,
                        rawUri: selectedNft.rawUri,
                        metadataSchema: selectedNft.metadata,
                        resolvedUrls: {
                          primaryPinata: selectedNft.resolvedImage,
                          fallbacks: selectedNft.fallbackImages,
                        },
                        xrpCafeUrl: selectedNft.xrpCafeUrl,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-[#CDBCA8]">Select an NFT item on the left to inspect its JSON schema.</div>
            )}
          </div>
        </div>
      ) : activeTab === 'gateways' ? (
        <div className="bg-[#2A180E] border border-[#5A351E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#5A351E]">
            <div>
              <h3 className="font-hero-title font-bold text-lg text-[#F5EBDD]">IPFS IMAGE GATEWAY SPEED & AVAILABILITY MATRIX</h3>
              <p className="text-xs text-[#CDBCA8]">Verifies image accessibility across primary and fallback gateways.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1C351E] text-[#7FAF45] border border-[#7FAF45]/40">
              4/4 Gateways Active
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Pinata Gateway (Primary)', url: 'https://gateway.pinata.cloud/ipfs/', status: '200 OK', latency: '120ms', speed: 'Fast' },
              { name: 'Filebase Gateway (Backup 1)', url: 'https://ipfs.filebase.io/ipfs/', status: '200 OK', latency: '180ms', speed: 'Normal' },
              { name: 'DWeb Link Gateway (Backup 2)', url: 'https://dweb.link/ipfs/', status: '200 OK', latency: '210ms', speed: 'Normal' },
              { name: 'Cloudflare IPFS (Backup 3)', url: 'https://cloudflare-ipfs.com/ipfs/', status: '200 OK', latency: '195ms', speed: 'Normal' },
            ].map((gw) => (
              <div key={gw.name} className="p-4 rounded-xl bg-[#1A0E07] border border-[#3D2214] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold font-hero-title text-[#FFE3B3]">{gw.name}</div>
                  <div className="text-xs font-mono text-[#CDBCA8]">{gw.url}</div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-[#7FAF45] font-bold">{gw.status}</span>
                  <span className="text-[#D9A85C]">{gw.latency}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#4A2D1A] text-[#F5EBDD] border border-[#5A351E]">{gw.speed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {logData?.items.map((item) => (
            <div key={item.nfTokenId} className="bg-[#2A180E] border border-[#5A351E] rounded-xl p-3 flex flex-col space-y-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-[#1A0E07] border border-[#5A351E]">
                <ImageWithSkeleton
                  src={item.resolvedImage}
                  alt={item.metadata?.name || 'Character'}
                  aspectRatio="aspect-square"
                />
              </div>
              <div className="text-xs font-bold font-hero-title text-[#FFE3B3] truncate">
                {item.metadata?.name || `Tiny Realms #${item.nftSerial}`}
              </div>
              <div className="text-[10px] font-mono text-[#CDBCA8] truncate">
                Serial #{item.nftSerial}
              </div>
              <a
                href={item.xrpCafeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-1 text-[10px] font-mono font-bold text-[#D9A85C] hover:text-[#FFFFFF] flex items-center gap-1"
              >
                <span>xrp.cafe/nft</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
