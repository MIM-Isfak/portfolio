# Local portfolio icons

All icons are decorative beside visible text. Brand artwork keeps the downloaded geometry and colors. Images have empty `alt` text inside `aria-hidden` containers; inline SVGs also have `aria-hidden="true"` and `focusable="false"`. None has an SVG title tooltip.

| Local file | Actual use | Source and license |
| --- | --- | --- |
| `github.svg` | Hero, project-heading and contact GitHub links | [Simple Icons GitHub SVG](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg), [CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). Only the source title and image role were removed; geometry is unchanged. |
| `python.svg` | Python skill | [Official PSF logo-only SVG](https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg), linked by the [PSF logo page](https://www.python.org/community/logos/). Usage follows the [PSF trademark policy](https://www.python.org/psf/trademarks/) and [FAQ](https://www.python.org/psf/trademarks-faq/); original colors and artwork are retained. |
| `linkedin.svg` | LinkedIn profile hyperlink; blue “in” mark | [Devicon v2.17.0 LinkedIn original](https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/linkedin/linkedin-original.svg), MIT. |
| `java.svg` | Java skill; original blue/red coffee-cup artwork | [Devicon v2.17.0 Java original](https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/java/java-original.svg), MIT. |
| `aws.svg` | Cloud / AWS skill; original dark/orange wordmark | [Devicon v2.17.0 AWS original wordmark](https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/amazonwebservices/amazonwebservices-original-wordmark.svg), MIT. |
| `mail.svg` | Envelope, copied verbatim into an inline SVG in `index.html` | [Lucide Mail](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/mail.svg), ISC. |
| `network.svg` | Machine Learning connected nodes, copied verbatim into an inline SVG | [Lucide Network](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/network.svg), ISC. This is a generic concept icon. |
| `code-xml.svg` | Web Development code, copied verbatim into an inline SVG | [Lucide Code XML](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/code-xml.svg), ISC. This is a generic concept icon. |
| `cloud.svg` | Retained local asset, currently unused | [Lucide Cloud](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cloud.svg), ISC. |
| `file-code.svg` | Retained local asset, currently unused | [Lucide File Code](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/file-code.svg), ISC. |

Devicon's [MIT license](https://github.com/devicons/devicon/blob/v2.17.0/LICENSE), Copyright (c) 2015 konpa, is included in `LICENSE-devicon.txt`. Lucide's [ISC license](https://github.com/lucide-icons/lucide/blob/main/LICENSE) and notices are included in `LICENSE-lucide.txt`. Brand trademarks remain the property of their respective owners; collection licenses do not grant trademark ownership or imply endorsement.

LinkedIn's [specific “in” logo guidance](https://brand.linkedin.com/in-logo) permits members to use it as a hyperlink to their profile. The previous README incorrectly applied the full LinkedIn wordmark restriction to this use. The “in” mark remains blue and is not tinted to the site's accent. Java, Python and AWS artwork is likewise displayed in its source colors on a light plate; CSS only controls size and surrounding presentation.

## Rendering

External CSS masks failed when this portfolio was opened through `file://`: Chrome reported `CorsDisabledScheme` for the SVG mask requests, while regular image elements loaded. The same masks rendered over HTTP. Mail, network and code now use the local source geometry inline so their `stroke="currentColor"` inherits the document's theme color without an external mask request. Brand SVGs use regular image elements with explicit source fills; external SVG images do not inherit the document's `currentColor`.

Contact glyphs are 24px. Skill glyphs occupy 34px boxes, preserve their aspect ratio and sit in 48px containers. Skill cards retain article semantics and have no button role or tab stop.
