import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ExportOptions {
  filename?: string;
  quality?: number;
  format?: "a4" | "letter";
}
// Create an isolated clone without external stylesheet references
const createIsolatedClone = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;

  // Copy computed styles as inline styles to eliminate stylesheet dependency
  const copyComputedStyles = (original: Element, cloned: Element): void => {
    const children = Array.from(original.children);
    const clonedChildren = Array.from(cloned.children);

    // Copy styles for current element
    const computed = window.getComputedStyle(original as HTMLElement);
    const clonedEl = cloned as HTMLElement;

    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      const value = computed.getPropertyValue(prop);
      if (value) {
        clonedEl.style.setProperty(prop, value);
      }
    }

    // Recursively copy for children
    children.forEach((child, index) => {
      if (clonedChildren[index]) {
        copyComputedStyles(child, clonedChildren[index]);
      }
    });
  };

  copyComputedStyles(element, clone);
  return clone;
};

// Remove or convert problematic color values from all stylesheets
const stripStylesheetColors = (): void => {
  // Process all style tags
  const styleTags = document.querySelectorAll("style");
  styleTags.forEach((tag) => {
    if (tag.sheet) {
      try {
        const rules = tag.sheet.cssRules;
        for (let i = rules.length - 1; i >= 0; i--) {
          try {
            const rule = rules[i] as CSSStyleRule;
            if (rule.style) {
              const style = rule.style.cssText;
              // Remove or convert problematic colors
              const cleanedStyle = style
                .replace(/oklch\([^)]*\)/g, "#000000")
                .replace(/oklab\([^)]*\)/g, "#000000")
                .replace(/lch\([^)]*\)/g, "#000000")
                .replace(/lab\([^)]*\)/g, "#000000");

              if (cleanedStyle !== style) {
                rule.style.cssText = cleanedStyle;
              }
            }
          } catch {
            // Skip rules we can't access
          }
        }
      } catch (error) {
        console.warn("Could not modify stylesheet:", error);
      }
    }
  });
};

// Convert all colors to RGB format that html2canvas can parse
// const convertColorsToRgb = (element: HTMLElement): void => {
//   const allElements = [element, ...Array.from(element.querySelectorAll("*"))];

//   allElements.forEach((el) => {
//     const htmlEl = el as HTMLElement;
//     const computed = window.getComputedStyle(htmlEl);

//     const colorProps = [
//       "color",
//       "backgroundColor",
//       "borderColor",
//       "borderTopColor",
//       "borderRightColor",
//       "borderBottomColor",
//       "borderLeftColor",
//       "outlineColor",
//       "textDecorationColor",
//       "fill",
//       "stroke",
//     ];

//     colorProps.forEach((prop) => {
//       const value = computed.getPropertyValue(prop);
//       if (value && value !== "none" && value !== "transparent") {
//         try {
//           // Check if it's an oklch/oklab color
//           if (
//             value.includes("oklch") ||
//             value.includes("oklab") ||
//             value.includes("lch") ||
//             value.includes("lab")
//           ) {
//             // Parse and convert using color-core
//             const color = new Color(value);
//             const rgb = color.toRgb();
//             const rgbString = `rgb(${Math.round(rgb.r)}, ${Math.round(
//               rgb.g
//             )}, ${Math.round(rgb.b)})`;
//             htmlEl.style.setProperty(prop, rgbString, "important");
//           } else {
//             // For other colors, just ensure they're set as inline styles
//             htmlEl.style.setProperty(prop, value, "important");
//           }
//         } catch (error) {
//           // If color parsing fails, use the computed value as-is
//           htmlEl.style.setProperty(prop, value, "important");
//         }
//       }
//     });
//   });
// };

// Helper function to strip problematic style attributes before html2canvas processes
const stripProblematicStyles = (element: HTMLElement): void => {
  const allElements = [element, ...Array.from(element.querySelectorAll("*"))];
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const style = htmlEl.getAttribute("style") || "";
    // Remove any oklab/oklch references from style attribute
    const cleanedStyle = style
      .replace(/oklch\([^)]*\)/g, "")
      .replace(/oklab\([^)]*\)/g, "")
      .replace(/lch\([^)]*\)/g, "")
      .replace(/lab\([^)]*\)/g, "");

    if (cleanedStyle.trim()) {
      htmlEl.setAttribute("style", cleanedStyle);
    } else {
      htmlEl.removeAttribute("style");
    }
  });
};

export const exportProfileToPDF = async (
  elementId: string,
  profileName: string,
  options: ExportOptions = {},
): Promise<void> => {
  const {
    filename = `${profileName}-github-profile.pdf`,
    quality = 0.95,
    format = "a4",
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    // Clean stylesheets BEFORE cloning
    stripStylesheetColors();

    // Create isolated clone with inline computed styles
    const clone = createIsolatedClone(element);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = element.offsetWidth + "px";
    document.body.appendChild(clone);

    // Wait for clone to be rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Strip problematic color syntax from inline styles
    stripProblematicStyles(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      ignoreElements: (element: HTMLElement) => {
        const tagName = element.tagName.toLowerCase();
        return (
          ["button", "input", "select", "textarea"].includes(tagName) ||
          element.getAttribute("role") === "button"
        );
      },
    } as Parameters<typeof html2canvas>[1]);

    // Remove clone
    document.body.removeChild(clone);

    const imgWidth = format === "a4" ? 210 : 216;
    const pageHeight = format === "a4" ? 297 : 279;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: format,
    });

    const imgData = canvas.toDataURL("image/jpeg", quality);
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

export const exportSectionToPDF = async (
  sectionId: string,
  filename: string,
): Promise<void> => {
  const element = document.getElementById(sectionId);
  if (!element) {
    throw new Error("Section not found");
  }

  try {
    // Clean stylesheets BEFORE cloning
    stripStylesheetColors();

    // Create isolated clone with inline computed styles
    const clone = createIsolatedClone(element);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = element.offsetWidth + "px";
    document.body.appendChild(clone);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Strip problematic color syntax from inline styles
    stripProblematicStyles(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      ignoreElements: (element: HTMLElement) => {
        const tagName = element.tagName.toLowerCase();
        return ["button", "input", "select", "textarea"].includes(tagName);
      },
    } as Parameters<typeof html2canvas>[1]);
    document.body.removeChild(clone);

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    throw error;
  }
};
