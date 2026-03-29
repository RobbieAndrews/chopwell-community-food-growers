import React from 'react'
import {set, type StringInputProps} from 'sanity'

type UsefulLinkSectionColorOption = {
  value: string
  title: string
  swatch: string
  borderColor: string
  iconColor: string
}

export const usefulLinkSectionColorOptions = [
  {
    value: 'green',
    title: 'Green',
    swatch: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    borderColor: '#86efac',
    iconColor: '#166534',
  },
  {
    value: 'amber',
    title: 'Amber',
    swatch: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderColor: '#fcd34d',
    iconColor: '#92400e',
  },
  {
    value: 'sky',
    title: 'Sky',
    swatch: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
    borderColor: '#93c5fd',
    iconColor: '#1d4ed8',
  },
  {
    value: 'violet',
    title: 'Violet',
    swatch: 'linear-gradient(135deg, #ede9fe 0%, #fae8ff 100%)',
    borderColor: '#c4b5fd',
    iconColor: '#7c3aed',
  },
  {
    value: 'rose',
    title: 'Rose',
    swatch: 'linear-gradient(135deg, #ffe4e6 0%, #fce7f3 100%)',
    borderColor: '#f9a8d4',
    iconColor: '#be185d',
  },
  {
    value: 'gray',
    title: 'Gray',
    swatch: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    borderColor: '#d1d5db',
    iconColor: '#4b5563',
  },
] as const satisfies readonly UsefulLinkSectionColorOption[]

export function getUsefulLinkSectionColorTitle(value?: string) {
  return usefulLinkSectionColorOptions.find((option) => option.value === value)?.title ?? 'Color'
}

function CheckmarkIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 8.5 3 3 6-6" />
    </svg>
  )
}

function BadgePreviewIcon({color}: {color: string}) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

export function UsefulLinkSectionColorInput(props: StringInputProps) {
  const {onChange, readOnly, value} = props

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {usefulLinkSectionColorOptions.map((option) => {
        const isSelected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            disabled={readOnly}
            onClick={() => onChange(set(option.value))}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              width: '76px',
              padding: '8px',
              borderRadius: '16px',
              border: '1px solid #d6d3d1',
              background: isSelected ? '#f0fdf4' : '#fff',
              boxShadow: isSelected ? '0 0 0 1px rgba(21, 128, 61, 0.18)' : 'none',
              cursor: readOnly ? 'default' : 'pointer',
              opacity: readOnly ? 0.6 : 1,
              transition: 'all 150ms ease',
            }}
            aria-pressed={isSelected}
            aria-label={option.title}
            title={option.title}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '999px',
                border: `1px solid ${option.borderColor}`,
                background: option.swatch,
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              <BadgePreviewIcon color={option.iconColor} />
              {isSelected ? (
                <span
                  style={{
                    position: 'absolute',
                    right: '-4px',
                    top: '-4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '999px',
                    background: '#166534',
                    color: '#fff',
                    boxShadow: '0 0 0 2px #fff',
                  }}
                >
                  <CheckmarkIcon />
                </span>
              ) : null}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.2,
                color: '#292524',
              }}
            >
              {option.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}
