import React from 'react'
import {set, type StringInputProps} from 'sanity'

type IconNode = Array<
  [
    keyof React.JSX.IntrinsicElements,
    Record<string, number | string>,
  ]
>

type ProjectIconOption = {
  value: string
  title: string
  nodes: IconNode
}

export const projectIconOptions = [
  {
    value: 'leaf',
    title: 'Leaf',
    nodes: [
      ['path', {d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'}],
      ['path', {d: 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'}],
    ],
  },
  {
    value: 'sprout',
    title: 'Sprout',
    nodes: [
      ['path', {d: 'M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3'}],
      ['path', {d: 'M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4'}],
      ['path', {d: 'M5 21h14'}],
    ],
  },
  {
    value: 'carrot',
    title: 'Carrot',
    nodes: [
      ['path', {d: 'M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46'}],
      ['path', {d: 'M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z'}],
      ['path', {d: 'M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z'}],
    ],
  },
  {
    value: 'apple',
    title: 'Apple',
    nodes: [
      ['path', {d: 'M12 6.528V3a1 1 0 0 1 1-1h0'}],
      ['path', {d: 'M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21'}],
    ],
  },
  {
    value: 'house',
    title: 'House',
    nodes: [
      ['path', {d: 'M4 10.5 12 4l8 6.5'}],
      ['path', {d: 'M6.5 9.5V20h11V9.5'}],
      ['path', {d: 'M10 20v-5h4v5'}],
    ],
  },
  {
    value: 'map-pin',
    title: 'Map Pin',
    nodes: [
      ['path', {d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'}],
      ['circle', {cx: 12, cy: 10, r: 3}],
    ],
  },
  {
    value: 'utensils',
    title: 'Utensils',
    nodes: [
      ['path', {d: 'M6 4v7'}],
      ['path', {d: 'M3.5 4v4c0 1.4 1.1 2.5 2.5 2.5S8.5 9.4 8.5 8V4'}],
      ['path', {d: 'M6 10.5V20'}],
      ['path', {d: 'M16 4c-1.7 0-3 1.3-3 3v4h6V7c0-1.7-1.3-3-3-3Z'}],
      ['path', {d: 'M16 11v9'}],
    ],
  },
  {
    value: 'cooking-pot',
    title: 'Cooking Pot',
    nodes: [
      ['path', {d: 'M2 12h20'}],
      ['path', {d: 'M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8'}],
      ['path', {d: 'm4 8 16-4'}],
      ['path', {d: 'm8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8'}],
    ],
  },
  {
    value: 'users',
    title: 'Users',
    nodes: [
      ['path', {d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'}],
      ['circle', {cx: 9, cy: 7, r: 4}],
      ['path', {d: 'M22 21v-2a4 4 0 0 0-3-3.87'}],
      ['path', {d: 'M16 3.13a4 4 0 0 1 0 7.75'}],
    ],
  },
  {
    value: 'heart-handshake',
    title: 'Heart Handshake',
    nodes: [
      ['path', {d: 'M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762'}],
    ],
  },
  {
    value: 'book-open',
    title: 'Book Open',
    nodes: [
      ['path', {d: 'M12 7v14'}],
      ['path', {d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'}],
    ],
  },
  {
    value: 'calendar',
    title: 'Calendar',
    nodes: [
      ['path', {d: 'M8 2v4'}],
      ['path', {d: 'M16 2v4'}],
      ['rect', {x: 3, y: 4, width: 18, height: 18, rx: 2}],
      ['path', {d: 'M3 10h18'}],
    ],
  },
  {
    value: 'shovel',
    title: 'Shovel',
    nodes: [
      ['path', {d: 'M14 4h4v4'}],
      ['path', {d: 'm18 4-7.5 7.5'}],
      ['path', {d: 'M9.5 12.5 6 16'}],
      ['path', {d: 'm7.5 20 5-5-3.5-3.5-5 5c1.2 2.1 1.9 2.8 3.5 3.5Z'}],
    ],
  },
  {
    value: 'hammer',
    title: 'Hammer',
    nodes: [
      ['path', {d: 'm15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9'}],
      ['path', {d: 'm18 15 4-4'}],
      ['path', {d: 'm21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5'}],
    ],
  },
  {
    value: 'wrench',
    title: 'Wrench',
    nodes: [
      ['path', {d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z'}],
    ],
  },
  {
    value: 'fence',
    title: 'Fence',
    nodes: [
      ['path', {d: 'M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z'}],
      ['path', {d: 'M6 8h4'}],
      ['path', {d: 'M6 18h4'}],
      ['path', {d: 'm12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z'}],
      ['path', {d: 'M14 8h4'}],
      ['path', {d: 'M14 18h4'}],
      ['path', {d: 'm20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z'}],
    ],
  },
  {
    value: 'droplets',
    title: 'Droplets',
    nodes: [
      ['path', {d: 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z'}],
      ['path', {d: 'M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97'}],
    ],
  },
  {
    value: 'recycle',
    title: 'Recycle',
    nodes: [
      ['path', {d: 'M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5'}],
      ['path', {d: 'M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12'}],
      ['path', {d: 'm14 16-3 3 3 3'}],
      ['path', {d: 'M8.293 13.596 7.196 9.5 3.1 10.598'}],
      ['path', {d: 'm9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843'}],
      ['path', {d: 'm13.378 9.633 4.096 1.098 1.097-4.096'}],
    ],
  },
  {
    value: 'sun',
    title: 'Sun',
    nodes: [
      ['circle', {cx: 12, cy: 12, r: 4}],
      ['path', {d: 'M12 2v2'}],
      ['path', {d: 'M12 20v2'}],
      ['path', {d: 'm4.93 4.93 1.41 1.41'}],
      ['path', {d: 'm17.66 17.66 1.41 1.41'}],
      ['path', {d: 'M2 12h2'}],
      ['path', {d: 'M20 12h2'}],
      ['path', {d: 'm6.34 17.66-1.41 1.41'}],
      ['path', {d: 'm19.07 4.93-1.41 1.41'}],
    ],
  },
  {
    value: 'trees',
    title: 'Trees',
    nodes: [
      ['path', {d: 'M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z'}],
      ['path', {d: 'M7 16v6'}],
      ['path', {d: 'M13 19v3'}],
      ['path', {d: 'M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5'}],
    ],
  },
] as const satisfies readonly ProjectIconOption[]

export type ProjectIconValue = (typeof projectIconOptions)[number]['value']

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  border: '1px solid #d6d3d1',
  background: '#fff',
  color: '#166534',
  cursor: 'pointer',
  transition: 'all 150ms ease',
}

export function getProjectIconTitle(value?: string) {
  return projectIconOptions.find((option) => option.value === value)?.title ?? 'Icon'
}

function ProjectIconPreview({nodes}: {nodes: IconNode}) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {nodes.map(([tag, attributes], index) => React.createElement(tag, {key: index, ...attributes}))}
    </svg>
  )
}

export function ProjectIconInput(props: StringInputProps) {
  const {onChange, readOnly, value} = props

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 56px))',
        }}
      >
        {projectIconOptions.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              title={option.title}
              aria-label={option.title}
              disabled={readOnly}
              onClick={() => onChange(set(option.value))}
              style={{
                ...buttonStyle,
                background: isSelected ? '#dcfce7' : '#fff',
                borderColor: isSelected ? '#15803d' : '#d6d3d1',
                boxShadow: isSelected ? '0 0 0 2px rgba(21, 128, 61, 0.15)' : 'none',
                opacity: readOnly ? 0.6 : 1,
              }}
            >
              <ProjectIconPreview nodes={option.nodes} />
            </button>
          )
        })}
      </div>

      <p
        style={{
          margin: '10px 0 0',
          fontSize: '12px',
          color: '#a8a29e',
        }}
      >
        Hover an icon to see its name. Selected: {getProjectIconTitle(value)}.
      </p>
    </div>
  )
}
