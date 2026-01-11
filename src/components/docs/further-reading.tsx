import { source } from "@/lib/source";
import { findSiblings } from "fumadocs-core/page-tree";
import { Card, Cards } from "fumadocs-ui/components/card";

export function FurtherReading({ targetUrl }: { targetUrl: string }) {
  console.log(findSiblings(source.getPageTree(), targetUrl));
  return (
    <Cards>
      {findSiblings(source.getPageTree(), targetUrl).map((peer) => {
        if (peer.type === 'separator') return null;
        const targetNode = peer.type === 'folder' ? peer.index : peer;
        const icon = peer.icon;

        if (!targetNode) return null;

        return (
          <Card key={targetNode.url} title={targetNode.name} href={targetNode.url} icon={icon}>
            {targetNode.description}
          </Card>
        );
      })}
    </Cards>
  );
}
