export function compressDeflateRaw(data: BufferSource): Promise<ArrayBuffer> {
  return new Response(
    new Blob([data]).stream().pipeThrough(new CompressionStream("deflate-raw"))
  ).arrayBuffer();
}

export function decompressDeflateRaw(data: BufferSource): Promise<ArrayBuffer> {
  return new Response(
    new Blob([data])
      .stream()
      .pipeThrough(new DecompressionStream("deflate-raw"))
  ).arrayBuffer();
}
