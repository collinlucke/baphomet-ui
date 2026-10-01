import { Box, Typography } from "@mui/joy";
import { isEmptyRichText, sanitizeRichText } from "../MaterialList/richText";

export const ITEMS_PER_PAGE = 7;

export type MaterialPageItem = {
  id: number;
  materialName: string;
  imageUrl?: string;
  altName?: string;
  description?: string;
  purchaseUnit?: string;
  categoryName?: string;
};

type MaterialPageProps = {
  items: MaterialPageItem[];
  propertyName?: string;
  opportunityName?: string;
  pageNumber?: number;
  totalPages?: number;
};

export const MaterialPage = ({
  items,
  propertyName,
  opportunityName,
  pageNumber,
  totalPages,
}: MaterialPageProps) => {
  const logoSrc = `${import.meta.env.BASE_URL}full-logo.png`;

  // Group items by category for section headings
  const sections: { categoryName: string; items: MaterialPageItem[] }[] = [];
  for (const item of items) {
    const cat = item.categoryName ?? "";
    const last = sections[sections.length - 1];
    if (last && last.categoryName === cat) {
      last.items.push(item);
    } else {
      sections.push({ categoryName: cat, items: [item] });
    }
  }

  // Build flat ordered list with category headings inserted
  type Row =
    | { type: "heading"; label: string }
    | { type: "item"; item: MaterialPageItem; index: number };
  const rows: Row[] = [];
  let itemIndex = 0;
  for (const section of sections) {
    if (section.categoryName) {
      rows.push({ type: "heading", label: section.categoryName });
    }
    for (const item of section.items) {
      rows.push({ type: "item", item, index: itemIndex++ });
    }
  }

  const footerParts = ["MD Property Services"];
  const titleParts = [propertyName, opportunityName].filter(Boolean);
  if (titleParts.length) footerParts.push(titleParts.join(" | "));
  const pageText =
    pageNumber != null
      ? totalPages != null
        ? `Page ${pageNumber} of ${totalPages}`
        : `Page ${pageNumber}`
      : "";
  if (pageText) footerParts.push(pageText);
  const footerText = footerParts.join(" - ");

  return (
    <Box
      data-testid="sub-material-page"
      sx={{
        width: "calc(100% - 96px)",
        height: "calc(100% - 96px)",
        p: "48px",
        pb: "36px",
        position: "relative",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "8px",
      }}
    >
      {/* Logo watermark */}
      <img
        data-testid="sub-logo-watermark"
        src={logoSrc}
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: "-180px",
          width: "816px",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.06,
        }}
      />

      {rows.map((row, rowIdx) => {
        if (row.type === "heading") {
          return (
            <Typography
              key={`heading-${rowIdx}`}
              data-testid="sub-category-heading"
              sx={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#136739",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderBottom: "2px solid #136739",
                pb: "2px",
                mt: rowIdx === 0 ? 0 : "4px",
              }}
            >
              {row.label.endsWith("s") ? row.label : `${row.label}s`}
            </Typography>
          );
        }

        const { item, index } = row;
        const followsHeading =
          rowIdx > 0 && rows[rowIdx - 1]?.type === "heading";
        // eslint-disable-next-line no-lone-blocks
        {
          const isEven = index % 2 === 0;
          // SKEW controls how many px each ribbon slants on each side
          const SKEW = 18;

          const circle = (
            <Box
              data-testid="sub-material-image"
              sx={{
                width: "120px",
                height: "120px",
                flexShrink: 0,
                borderRadius: "50%",
                border: "3px solid #136739",
                overflow: "hidden",
                bgcolor: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.imageUrl ? (
                <img
                  data-testid="sub-material-image-img"
                  src={item.imageUrl}
                  alt={item.materialName}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography
                  data-testid="sub-material-no-image"
                  level="body-xs"
                  sx={{ color: "#136739", textAlign: "center", px: 0.5 }}
                >
                  No Image
                </Typography>
              )}
            </Box>
          );

          // Two stacked parallelogram ribbons per item.
          // Top ribbon: far end kept, near end (circle side) angle switched → trapezoid (wider at top)
          // Bottom ribbon: angles fully switched vs previous
          const topClip = `polygon(0 0, 100% 0, calc(100% - ${SKEW}px) 100%, ${SKEW}px 100%)`;

          const bottomClip = isEven
            ? `polygon(${SKEW}px 0, 100% 0, calc(100% - ${SKEW}px) 100%, 0 100%)`
            : `polygon(0 0, calc(100% - ${SKEW}px) 0, 100% 100%, ${SKEW}px 100%)`;
          const textAlign = isEven ? "left" : "right";
          const px = `${SKEW + 8}px`;

          // Bottom ribbon is ~200px shorter and offset toward the circle side
          const bottomWidthCalc = isEven
            ? "calc(100% - 200px)"
            : "calc(100% - 200px)";
          const bottomAlign = isEven ? "flex-start" : "flex-end";

          const ribbonStack = (
            <Box
              data-testid="sub-ribbon-stack"
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {/* Top ribbon — common name */}
              <Box
                data-testid="sub-ribbon-common-name"
                sx={{
                  height: "44px",
                  bgcolor: "#136739",
                  clipPath: topClip,
                  display: "flex",
                  alignItems: "center",
                  px,
                }}
              >
                <Typography
                  data-testid="sub-common-name-text"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    lineHeight: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    textAlign,
                  }}
                >
                  {item.materialName}
                </Typography>
              </Box>
              {/* Bottom ribbon — botanical / alternate name, ~200px shorter */}
              <Box sx={{ display: "flex", justifyContent: bottomAlign }}>
                <Box
                  data-testid="sub-ribbon-alt-name"
                  sx={{
                    width: bottomWidthCalc,
                    height: "36px",
                    bgcolor: "#1a7d47",
                    clipPath: bottomClip,
                    display: "flex",
                    alignItems: "center",
                    px,
                  }}
                >
                  <Typography
                    data-testid="sub-alt-name-text"
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "16px",
                      fontStyle: "italic",
                      lineHeight: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                      textAlign,
                    }}
                  >
                    {item.altName ?? ""}
                  </Typography>
                </Box>
              </Box>
              {item.description && !isEmptyRichText(item.description) && (
                <Box
                  data-testid="sub-material-description"
                  sx={{
                    mt: "6px",
                    color: "#1a1a1a",
                    fontSize: "14px",
                    lineHeight: 1.35,
                    textAlign: "left",
                    "& img": {
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: "160px",
                      objectFit: "contain",
                      mt: "6px",
                    },
                    "& p": { m: 0 },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichText(item.description),
                  }}
                />
              )}
            </Box>
          );

          return (
            <Box
              key={item.id}
              data-testid="sub-material-item"
              sx={{
                display: "flex",
                mt: followsHeading ? "15px" : 0,
                alignItems:
                  item.description && !isEmptyRichText(item.description)
                    ? "flex-start"
                    : "center",
                gap: "16px",
                flexDirection: isEven ? "row" : "row-reverse",
              }}
            >
              {circle}
              {ribbonStack}
            </Box>
          );
        }
      })}

      {/* Footer */}
      <Box
        data-testid="sub-page-footer"
        sx={{
          position: "absolute",
          bottom: "18px",
          left: "48px",
          right: "48px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          borderTop: "1px solid #136739",
          pt: "6px",
        }}
      >
        <Typography
          data-testid="sub-footer-text"
          sx={{
            fontSize: "11px",
            color: "#136739",
            opacity: 0.8,
            textAlign: "right",
          }}
        >
          {footerText}
        </Typography>
      </Box>
    </Box>
  );
};
